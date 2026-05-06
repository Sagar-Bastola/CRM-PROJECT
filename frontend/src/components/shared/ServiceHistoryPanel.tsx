import { useState, useRef } from 'react'
import { Wrench, Plus, Trash2, Calendar, DollarSign, User, ChevronRight, ScanLine, Loader } from 'lucide-react'
import { useServiceRecords, useCreateServiceRecord, useDeleteServiceRecord } from '../../hooks/useServiceRecords'
import { useForm } from 'react-hook-form'
import { createWorker } from 'tesseract.js'
import * as pdfjsLib from 'pdfjs-dist'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

interface Props {
  equipmentId: number
}

const SERVICE_TYPES = ['Maintenance', 'Repair', 'Inspection', 'Oil Change', 'Other']

const typeColors: Record<string, string> = {
  Maintenance: 'bg-blue-100 text-blue-700',
  Repair: 'bg-red-100 text-red-700',
  Inspection: 'bg-purple-100 text-purple-700',
  'Oil Change': 'bg-amber-100 text-amber-700',
  Other: 'bg-gray-100 text-gray-600',
}

const parseExtractedText = (text: string) => {
  const result: Record<string, string> = {}
  const lower = text.toLowerCase()

  for (const type of SERVICE_TYPES) {
    if (lower.includes(type.toLowerCase())) {
      result.serviceType = type
      break
    }
  }

  const dateMatch = text.match(/\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{2}[\/\-]\d{2})\b/)
  if (dateMatch) {
    const parsed = new Date(dateMatch[0])
    if (!isNaN(parsed.getTime())) {
      result.serviceDate = parsed.toISOString().split('T')[0]
    }
  }

  const costMatch = text.match(/\$?\s*(\d{1,6}(?:\.\d{1,2})?)/)
  if (costMatch) result.cost = costMatch[1]

  const techMatch = text.match(/(?:tech(?:nician)?|mechanic|by|performed by)[:\s]+([A-Za-z\s]{2,30})/i)
  if (techMatch) result.technicianName = techMatch[1].trim()

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 10)
  if (lines.length > 0) result.description = lines[0]

  return result
}

const pdfToImageBlob = async (file: File): Promise<Blob> => {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const page = await pdf.getPage(1)
  const viewport = page.getViewport({ scale: 2.0 })

  const canvas = document.createElement('canvas')
  canvas.width = viewport.width
  canvas.height = viewport.height

  const ctx = canvas.getContext('2d')!
  await page.render({
    canvasContext: ctx,
    viewport,
    canvas,
  } as any).promise

  return new Promise(resolve => canvas.toBlob(blob => resolve(blob!), 'image/png'))
}

const ServiceHistoryPanel: React.FC<Props> = ({ equipmentId }) => {
  const { data: records, isLoading } = useServiceRecords(equipmentId)
  const createRecord = useCreateServiceRecord(equipmentId)
  const deleteRecord = useDeleteServiceRecord(equipmentId)

  const [showModal, setShowModal] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm({
    defaultValues: {
      serviceType: 'Maintenance',
      serviceDate: new Date().toISOString().split('T')[0],
      description: '',
      cost: '',
      technicianName: '',
      nextServiceDate: '',
    }
  })

  const handleScanDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setScanning(true)
    setScanProgress('Initializing scanner...')
    setShowModal(true)

    try {
      let imageSource: File | Blob = file

      if (file.type === 'application/pdf') {
        setScanProgress('Converting PDF to image...')
        imageSource = await pdfToImageBlob(file)
      }

      const worker = await createWorker('eng', 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            setScanProgress(`Scanning... ${Math.round(m.progress * 100)}%`)
          }
        }
      })

      setScanProgress('Reading document...')
      const { data: { text } } = await worker.recognize(imageSource)
      await worker.terminate()

      setScanProgress('Extracting fields...')
      const extracted = parseExtractedText(text)

      if (extracted.serviceType) form.setValue('serviceType', extracted.serviceType)
      if (extracted.serviceDate) form.setValue('serviceDate', extracted.serviceDate)
      if (extracted.cost) form.setValue('cost', extracted.cost)
      if (extracted.technicianName) form.setValue('technicianName', extracted.technicianName)
      if (extracted.description) form.setValue('description', extracted.description)

      setScanProgress('Done! Review the fields below.')
    } catch (err) {
      setScanProgress('Scan failed. Fill in manually.')
    } finally {
      setScanning(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleCreate = async (data: any) => {
    await createRecord.mutateAsync({
      ...data,
      cost: data.cost ? parseFloat(data.cost) : null,
      nextServiceDate: data.nextServiceDate || null,
    })
    form.reset()
    setShowModal(false)
    setScanProgress('')
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteRecord.mutateAsync(deleteId)
    setDeleteId(null)
  }

  if (isLoading) return <div className="p-4 text-sm text-gray-400">Loading service history...</div>

  return (
    <div className="bg-white rounded-xl border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <Wrench size={15} className="text-amber-500" />
          <h3 className="font-semibold text-gray-800 text-sm">Service History</h3>
          {records && records.length > 0 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
              {records.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleScanDocument}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={scanning}
          >
            {scanning
              ? <><Loader size={13} className="animate-spin" /> Scanning...</>
              : <><ScanLine size={13} /> Scan Document</>
            }
          </Button>
          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus size={13} /> Log Service
          </Button>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {!records?.length ? (
          <div className="py-10 text-center">
            <Wrench size={28} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No service records yet</p>
            <p className="text-xs text-gray-400 mt-1">Log manually or scan a service document above</p>
          </div>
        ) : (
          records.map(record => (
            <div key={record.serviceRecordID} className="p-4 hover:bg-gray-50 transition-colors group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Wrench size={15} className="text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[record.serviceType] ?? 'bg-gray-100 text-gray-600'}`}>
                        {record.serviceType}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={11} />
                        {new Date(record.serviceDate).toLocaleDateString()}
                      </div>
                    </div>
                    {record.description && (
                      <p className="text-sm text-gray-700 mt-1.5">{record.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                      {record.technicianName && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <User size={11} />
                          {record.technicianName}
                        </div>
                      )}
                      {record.cost != null && (
                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                          <DollarSign size={11} />
                          {record.cost.toLocaleString()}
                        </div>
                      )}
                      {record.nextServiceDate && (
                        <div className="flex items-center gap-1 text-xs text-amber-600">
                          <ChevronRight size={11} />
                          Next: {new Date(record.nextServiceDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteId(record.serviceRecordID)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setScanProgress('') }}
        title="Log Service Record"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowModal(false); setScanProgress('') }}>Cancel</Button>
            <Button form="service-form" type="submit" loading={createRecord.isPending}>Save Record</Button>
          </>
        }
      >
        {scanProgress && (
          <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
            {scanning && <Loader size={13} className="animate-spin text-amber-500" />}
            <p className="text-xs text-amber-700 font-medium">{scanProgress}</p>
          </div>
        )}
        <form id="service-form" onSubmit={form.handleSubmit(handleCreate)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                {...form.register('serviceType', { required: true })}
              >
                {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <Input
              label="Service Date *"
              type="date"
              {...form.register('serviceDate', { required: true })}
            />
            <Input
              label="Technician Name"
              placeholder="e.g. John Smith"
              {...form.register('technicianName')}
            />
            <Input
              label="Cost ($)"
              type="number"
              placeholder="0.00"
              {...form.register('cost')}
            />
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Describe the work performed..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 resize-none"
                {...form.register('description')}
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Next Service Date"
                type="date"
                {...form.register('nextServiceDate')}
              />
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Service Record"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteRecord.isPending}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600 text-center py-4">
          Are you sure you want to delete this service record? This cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

export default ServiceHistoryPanel