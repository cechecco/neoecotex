import { z } from 'zod'

// Base type with common fields
export interface InnovationRequestData {
  title: string
  company: string
  briefDescription: string
  detailedDescription: string
  expectedExpertise: string
  expectedTimeline: string
  budget: number
  concept: string
  field: string
  marketingConsent: boolean
  ecologyConsent: boolean
}

export interface InnovationRequestWithMetadata extends InnovationRequestData {
  owner: string
  winner: string | null | undefined
  submissionsId: string[]
}

// Type for requests from the database (extends the base with DB-specific fields)
export interface InnovationRequest extends InnovationRequestWithMetadata {
  $id: string
  $createdAt: string
  $updatedAt: string
}

export interface EditableInnovationRequestProps {
  request: InnovationRequest
  isEditing: boolean
  onSave: (request: InnovationRequest) => Promise<void>
  onCancel: () => void
}

export interface ValidationError {
  validationError: boolean
  errors: Record<string, string[]>
}

export interface DatabaseError {
  error: true
  message: string
}

export const innovationRequestSchema = z.object({
    title: z.string().min(1, 'Title is required').max(64, 'Title must be less than 64 characters'),
    company: z.string().min(1, 'Company is required').max(64, 'Company must be less than 64 characters'),
    briefDescription: z.string().min(1, 'Brief description is required').max(140, 'Brief description must be less than 140 characters'),
    detailedDescription: z.string().min(1, 'Detailed description is required').max(1000, 'Detailed description must be less than 1000 characters'),
    expectedExpertise: z.string().min(1, 'Expected expertise is required').max(140, 'Expected expertise must be less than 140 characters'),
    expectedTimeline: z.string().min(1, 'Expected timeline is required').max(140, 'Expected timeline must be less than 140 characters'),
    budget: z.number().min(100, 'Budget must be greater than 100'),
    concept: z.string().min(1, 'Concept is required').max(140, 'Concept must be less than 140 characters'),
    field: z.string().min(1, 'Field is required').max(140, 'Field must be less than 140 characters'),
    marketingConsent: z.boolean(),
    ecologyConsent: z.boolean(),
}) as z.ZodType<InnovationRequestData>

export interface SubmissionData {
  $id?: string
  title: string
  briefDescription: string
}

export interface SubmissionWithMetadata extends SubmissionData {
  owner: string
  requestId: string
}

export interface Submission extends SubmissionWithMetadata {
  $id?: string,
  $createdAt?: string,
  $updatedAt?: string,
}

export const submissionSchema = z.object({
    title: z.string().min(1, 'Title is required').max(64, 'Title must be less than 64 characters'),
    briefDescription: z.string().min(1, 'Brief description is required').max(140, 'Brief description must be less than 140 characters'),
}) as z.ZodType<SubmissionData>

