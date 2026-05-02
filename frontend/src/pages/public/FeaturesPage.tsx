import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Truck, Users, Building2, CheckSquare,
  FileText, GitBranch, Tag, BarChart3, Shield,
} from 'lucide-react'
import Button from '../../components/ui/Button'

const features = [
  {
    icon: Truck,
    title: 'Equipment fleet tracking',
    desc: 'Full machine records with serial numbers, model years, GPS coordinates and service history.',
    items: ['Serial number & model history', 'Last service date alerts', 'GPS location tracking', 'Category filtering'],
  },
  {
    icon: Users,
    title: 'Lead management',
    desc: 'Capture every inquiry from any source. Track through your pipeline with visual status badges.',
    items: ['Lead source tracking', 'Status workflow', 'Convert to opportunity', 'Lead dashboard'],
  },
  {
    icon: BarChart3,
    title: 'Opportunity pipeline',
    desc: 'Full Kanban pipeline from Discovery to Closed Won. Track deal values and expected close dates.',
    items: ['Visual Kanban board', 'Deal value tracking', 'Stage management', 'Win/loss analysis'],
  },
  {
    icon: Building2,
    title: 'Company accounts',
    desc: 'Full company profiles with address, branch, contacts, equipment, leads and notes.',
    items: ['Complete company profiles', 'Branch organization', 'Contact management', 'Full history'],
  },
  {
    icon: CheckSquare,
    title: 'Task tracking',
    desc: 'Assign follow-up tasks to reps. Overdue tasks highlighted in red. Linked to any record.',
    items: ['Overdue alerts', 'Assign to any user', 'Link to any record', 'Due date tracking'],
  },
  {
    icon: FileText,
    title: 'Notes & activity',
    desc: 'Log field notes on companies, contacts, equipment, leads and opportunities.',
    items: ['Attach to any record', 'Full activity timeline', 'Author & timestamp', 'Search notes'],
  },
  {
    icon: GitBranch,
    title: 'Multi-branch support',
    desc: 'Manage multiple dealership locations from one account with per-branch data.',
    items: ['Branch-level isolation', 'Admin cross-branch view', 'Per-branch reporting', 'Location management'],
  },
  {
    icon: Shield,
    title: 'Role-based access',
    desc: 'Admin and User roles. Admins see everything. Sales reps see their data.',
    items: ['Admin full access', 'User role restrictions', 'JWT authentication', 'Secure API'],
  },
  {
    icon: Tag,
    title: 'Equipment categories',
    desc: 'Organize equipment by category — Dozer, Excavator, Backhoe, Tractor and more.',
    items: ['Custom categories', 'Filter by category', 'Category counts', 'Easy management'],
  },
]

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div>
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-6 text-center">
        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
          Full feature list
        </span>
        <h1 className="text-4xl font-bold mt-2 mb-3">
          Everything a heavy equipment dealer needs
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Purpose-built for CAT, John Deere, Komatsu and any OEM dealership.
        </p>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {features.map(f => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:border-amber-200 transition-all"
            >
              <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
                <f.icon size={22} className="text-amber-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{f.desc}</p>
              <ul className="space-y-1.5">
                {f.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 px-6 bg-white text-center border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ready to get started?
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Join 500+ heavy equipment dealers already using HeavyTrack CRM.
        </p>
        <Button onClick={() => navigate('/contact')}>
          Request a Free Demo
        </Button>
      </section>
    </div>
  )
}

export default FeaturesPage