import { Models } from 'node-appwrite'
import { z } from 'zod'

export const requestSchema = z.object({
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
}).strict()

export interface RequestMetadata {
  owner: string
  winner: string | null
  submissionsId: string[]
}

export type RequestData = z.infer<typeof requestSchema>

export type RequestCreateInput = RequestData & RequestMetadata

export type Request = RequestData & RequestMetadata & Models.Document

export const submissionSchema = z.object({
  $id: z.string(),
  $createdAt: z.string(),
  $updatedAt: z.string(),
  owner: z.string(),
  requestId: z.string(),
  title: z.string().min(1, 'Title is required').max(64, 'Title must be less than 64 characters'),
  briefDescription: z.string().min(1, 'Brief description is required').max(140, 'Brief description must be less than 140 characters'),
}).strict()

export type Submission = z.infer<typeof submissionSchema>

export type SubmissionCreateInput = Omit<Submission, '$id' | '$createdAt' | '$updatedAt'>
