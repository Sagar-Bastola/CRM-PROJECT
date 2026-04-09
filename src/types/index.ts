// ── Auth ──────────────────────────────────────────────────
export interface LoginDto {
  emailOrUsername: string
  password: string
}

export interface RegisterDto {
  username: string
  email: string
  password: string
  role: string
}

export interface AuthResponse {
  userID: number
  token: string
  username: string
  email: string
  role: string
}

// ── User ──────────────────────────────────────────────────
export interface User {
  userID: number
  username: string
  email: string
  role: string
  createdAt: string
}

export interface UpdateUserDto {
  username?: string
  email?: string
  role?: string
  password?: string
}

// ── Branch ────────────────────────────────────────────────
export interface Branch {
  branchID: number
  name: string
}

export interface CreateBranchDto {
  name: string
}

export interface UpdateBranchDto {
  name: string
}

// ── Company ───────────────────────────────────────────────
export interface Company {
  companyID: number
  branchID?: number
  branchName?: string
  name: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  zip?: string
  county?: string
  country?: string
  longitude?: number
  latitude?: number
  phone?: string
  website?: string
  createdAt: string
  lastModified: string
}

export interface CreateCompanyDto {
  branchID?: number
  name: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  zip?: string
  county?: string
  country?: string
  longitude?: number
  latitude?: number
  phone?: string
  website?: string
}

export interface UpdateCompanyDto extends Partial<CreateCompanyDto> {}

// ── Contact ───────────────────────────────────────────────
export interface Contact {
  contactID: number
  companyID: number
  companyName?: string
  name: string
  email?: string
  phone?: string
  position?: string
  createdAt: string
  lastModified: string
}

export interface CreateContactDto {
  companyID: number
  name: string
  email?: string
  phone?: string
  position?: string
}

export interface UpdateContactDto extends Partial<CreateContactDto> {}

// ── Equipment Category ────────────────────────────────────
export interface EquipmentCategory {
  categoryID: number
  name: string
}

export interface CreateEquipmentCategoryDto {
  name: string
}

export interface UpdateEquipmentCategoryDto {
  name: string
}

// ── Equipment ─────────────────────────────────────────────
export interface Equipment {
  equipmentID: number
  companyID: number
  companyName?: string
  categoryID?: number
  categoryName?: string
  name: string
  model?: string
  serialNumber?: string
  year?: number
  lastServiceDate?: string
  longitude?: number
  latitude?: number
  createdAt: string
  lastModified: string
}

export interface CreateEquipmentDto {
  companyID: number
  categoryID?: number
  name: string
  model?: string
  serialNumber?: string
  year?: number
  lastServiceDate?: string
  longitude?: number
  latitude?: number
}

export interface UpdateEquipmentDto extends Partial<Omit<CreateEquipmentDto, 'companyID'>> {}

// ── Lead ──────────────────────────────────────────────────
export interface Lead {
  leadID: number
  companyID: number
  companyName?: string
  contactID?: number
  contactName?: string
  source?: string
  status: string
  createdByUserID: number
  createdByUsername?: string
  createdAt: string
  lastModified: string
}

export interface CreateLeadDto {
  companyID: number
  contactID?: number
  source?: string
  status: string
}

export interface UpdateLeadDto {
  contactID?: number
  source?: string
  status?: string
}

// ── Opportunity ───────────────────────────────────────────
export interface Opportunity {
  opportunityID: number
  companyID: number
  companyName?: string
  contactID?: number
  contactName?: string
  name: string
  value?: number
  stage: string
  closeDate?: string
  status: string
  createdByUserID: number
  createdByUsername?: string
  createdAt: string
  lastModified: string
}

export interface CreateOpportunityDto {
  companyID: number
  contactID?: number
  name: string
  value?: number
  stage: string
  closeDate?: string
  status: string
}

export interface UpdateOpportunityDto extends Partial<Omit<CreateOpportunityDto, 'companyID'>> {}

// ── Note ──────────────────────────────────────────────────
export interface Note {
  noteID: number
  relatedRecordID: number
  relatedRecordType: string
  userID: number
  authorUsername?: string
  noteText: string
  createdAt: string
  lastModified: string
}

export interface CreateNoteDto {
  relatedRecordID: number
  relatedRecordType: string
  noteText: string
}

export interface UpdateNoteDto {
  noteText: string
}

// ── Task ──────────────────────────────────────────────────
export interface Task {
  taskID: number
  subject: string
  description?: string
  dueDate?: string
  isCompleted: boolean
  completedDate?: string
  relatedRecordID: number
  relatedRecordType: string
  assignedToUserID?: number
  assignedToUsername?: string
  createdAt: string
  lastModified: string
}

export interface CreateTaskDto {
  subject: string
  description?: string
  dueDate?: string
  relatedRecordID: number
  relatedRecordType: string
  assignedToUserID?: number
}

export interface UpdateTaskDto {
  subject?: string
  description?: string
  dueDate?: string
  isCompleted?: boolean
  assignedToUserID?: number
}