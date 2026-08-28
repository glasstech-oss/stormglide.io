import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './db'

// ─── INQUIRIES ───
export const addInquiry = async (data) => {
  return await addDoc(collection(db, 'inquiries'), {
    ...data,
    status: 'new',
    createdAt: serverTimestamp(),
  })
}

export const getInquiries = async () => {
  const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getInquiry = async (id) => {
  const docRef = doc(db, 'inquiries', id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
}

export const updateInquiry = async (id, data) => {
  const docRef = doc(db, 'inquiries', id)
  return await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// ─── PROJECTS ───
export const addProject = async (data) => {
  return await addDoc(collection(db, 'projects'), {
    ...data,
    status: 'proposal',
    createdAt: serverTimestamp(),
  })
}

export const getProjects = async () => {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getProjectsByClient = async (clientId) => {
  const q = query(collection(db, 'projects'), where('clientId', '==', clientId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getProject = async (id) => {
  const docRef = doc(db, 'projects', id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
}

export const updateProject = async (id, data) => {
  const docRef = doc(db, 'projects', id)
  return await updateDoc(docRef, {
    ...data,
    lastUpdated: serverTimestamp(),
  })
}

// ─── CLIENTS ───
export const addClient = async (data) => {
  return await addDoc(collection(db, 'clients'), {
    ...data,
    status: 'active',
    createdAt: serverTimestamp(),
  })
}

export const getClients = async () => {
  const snapshot = await getDocs(collection(db, 'clients'))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getClient = async (id) => {
  const docRef = doc(db, 'clients', id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
}

export const updateClient = async (id, data) => {
  const docRef = doc(db, 'clients', id)
  return await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// ─── TEAM ───
export const addTeamMember = async (data) => {
  return await addDoc(collection(db, 'team'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export const getTeam = async () => {
  const snapshot = await getDocs(collection(db, 'team'))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getTeamMember = async (id) => {
  const docRef = doc(db, 'team', id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
}

export const updateTeamMember = async (id, data) => {
  const docRef = doc(db, 'team', id)
  return await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// ─── SUPPORT TICKETS ───
export const addSupportTicket = async (data) => {
  return await addDoc(collection(db, 'supportTickets'), {
    ...data,
    status: 'open',
    createdAt: serverTimestamp(),
  })
}

export const getSupportTickets = async () => {
  const q = query(collection(db, 'supportTickets'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getTicketsByProject = async (projectId) => {
  const q = query(collection(db, 'supportTickets'), where('projectId', '==', projectId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const updateSupportTicket = async (id, data) => {
  const docRef = doc(db, 'supportTickets', id)
  return await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// ─── INVOICES ───
export const addInvoice = async (data) => {
  return await addDoc(collection(db, 'invoices'), {
    ...data,
    status: 'draft',
    createdAt: serverTimestamp(),
  })
}

export const getInvoices = async () => {
  const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getInvoicesByProject = async (projectId) => {
  const q = query(collection(db, 'invoices'), where('projectId', '==', projectId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const updateInvoice = async (id, data) => {
  const docRef = doc(db, 'invoices', id)
  return await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}
