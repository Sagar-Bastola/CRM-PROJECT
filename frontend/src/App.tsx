import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './layouts/ProtectedRoute'

import HomePage from './pages/public/HomePage'
import FeaturesPage from './pages/public/FeaturesPage'
import PricingPage from './pages/public/PricingPage'
import AboutPage from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'

import DashboardPage from './pages/app/DashboardPage'
import CompaniesPage from './pages/app/companies/CompaniesPage'
import CompanyDetailPage from './pages/app/companies/CompanyDetailPage'
import ContactsPage from './pages/app/contacts/ContactsPage'
import ContactDetailPage from './pages/app/contacts/ContactDetailPage'
import EquipmentPage from './pages/app/equipment/EquipmentPage'
import EquipmentDetailPage from './pages/app/equipment/EquipmentDetailPage'
import LeadsPage from './pages/app/LeadsPage'
import OpportunitiesPage from './pages/app/OpportunitiesPage'
import TasksPage from './pages/app/TasksPage'
import NotesPage from './pages/app/NotesPage'
import UsersPage from './pages/app/UsersPage'
import BranchesPage from './pages/app/BranchesPage'
import EqCategoriesPage from './pages/app/EqCategoriesPage'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/app" element={<DashboardPage />} />
            <Route path="/app/companies" element={<CompaniesPage />} />
            <Route path="/app/companies/:id" element={<CompanyDetailPage />} />
            <Route path="/app/contacts" element={<ContactsPage />} />
            <Route path="/app/contacts/:id" element={<ContactDetailPage />} />
            <Route path="/app/equipment" element={<EquipmentPage />} />
            <Route path="/app/equipment/:id" element={<EquipmentDetailPage />} />
            <Route path="/app/leads" element={<LeadsPage />} />
            <Route path="/app/opportunities" element={<OpportunitiesPage />} />
            <Route path="/app/tasks" element={<TasksPage />} />
            <Route path="/app/notes" element={<NotesPage />} />
            <Route path="/app/users" element={<UsersPage />} />
            <Route path="/app/branches" element={<BranchesPage />} />
            <Route path="/app/eq-categories" element={<EqCategoriesPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App