import { Models } from 'node-appwrite'
import { z } from 'zod'

const MAX_FILE_SIZE = 800000 // 800kb
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

export const requestSchema = z
  .object({
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
    imagesIds: z.array(z.string()),
  })
  .strict()

const maxImages = 1
const minImages = 1

export const imageSchema = z.object({
  images: z
    .array(
      z
        .any()
        .refine((val) => {
          if (!val || typeof val !== 'object' || !('size' in val) || !('type' in val)) {
            return false
          }
          return true
        }, 'Please provide a valid file')
        .refine(
          (val) => {
            if (val.size > MAX_FILE_SIZE) {
              return false
            }
            return true
          },
          `File size must be less than ${MAX_FILE_SIZE / 1000000}MB`
        )
        .refine(
          (val) => {
            if (!ACCEPTED_IMAGE_TYPES.includes(val.type)) {
              return false
            }
            return true
          },
          `File must be one of ${ACCEPTED_IMAGE_TYPES.join(', ')}`
        )
    )
    .max(maxImages, `You can upload a maximum of ${maxImages} images`)
    .min(1, `You must upload at least ${minImages} image`),
})

export interface RequestMetadata {
  owner: string
  winner: string | null
  submissionsId: string[]
}

export type RequestData = z.infer<typeof requestSchema>

export type RequestCreateInput = RequestData & RequestMetadata

export type Request = RequestData & RequestMetadata & Models.Document

export const submissionSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(64, 'Title must be less than 64 characters'),
    briefDescription: z.string().min(1, 'Brief description is required').max(140, 'Brief description must be less than 140 characters'),
    detailedDescription: z.string().min(1, 'Detailed description is required').max(1500, 'Detailed description must be less than 1500 characters'),
    expertisePreferences: z.string().min(1, 'Expertise preferences is required').max(1500, 'Expertise preferences must be less than 1500 characters'),
    timelineScope: z.string().min(1, 'Timeline scope is required').max(1500, 'Timeline scope must be less than 1500 characters'),
    requestId: z.string().min(1, 'Request ID is required'),
    imagesIds: z.array(z.string()),
    marketingConsent: z.boolean().default(false),
    ecologyConsent: z.boolean().default(false),
  })
  .strict()

export interface SubmissionMetadata {
  owner: string
}

export type SubmissionData = z.infer<typeof submissionSchema>

export type SubmissionCreateInput = SubmissionData & SubmissionMetadata

export type Submission = SubmissionData & SubmissionMetadata & Models.Document

export type RequestCheck = {
  iAmOwner: boolean
  iAmWinner: boolean
  iHaveSubmitted: boolean
  thereIsWinner: boolean
  winnerEmail: string | undefined
  requestId: string
  requestTitle: string
  submissionsTitles: Record<string, string>
  userType: string | undefined
}

export type RequestChecksMap = Record<string, RequestCheck>

export const baseUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
})

export const loginUserSchema = baseUserSchema.extend({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
})

export const userSchema = baseUserSchema.extend({
  email: z.string().email('Invalid email address'),
  surname: z.string().min(1, 'Surname is required').max(100, 'Surname must be less than 100 characters'),
  type: z.enum(['innovator', 'requester']),
  country: z.string().min(1, 'Country is required').max(100, 'Country must be less than 100 characters'),
  city: z.string().min(1, 'City is required').max(100, 'City must be less than 100 characters'),
  imagesIds: z.array(z.string()),
})

export const requesterSchema = userSchema.extend({
  companyName: z.string().min(1, 'Company name is required').max(100, 'Company name must be less than 100 characters'),
  companySize: z.number().min(1, 'Company size must be greater than 0').max(1000000, 'Company size must be less than 1000000'),
})

export const innovatorSchema = userSchema.extend({
  occupation: z.string().min(1, 'Occupation is required').max(100, 'Occupation must be less than 100 characters'),
})

export const userImageSchema = z.object({
  images: z
    .array(
      z
        .any()
        .refine((val) => {
          if (!val || typeof val !== 'object' || !('size' in val) || !('type' in val)) {
            return false
          }
          return true
        }, 'Please provide a valid file')
        .refine(
          (val) => {
            if (val.size > MAX_FILE_SIZE) {
              return false
            }
            return true
          },
          `File size must be less than ${MAX_FILE_SIZE / 1000000}MB`
        )
        .refine(
          (val) => {
            if (!ACCEPTED_IMAGE_TYPES.includes(val.type)) {
              return false
            }
            return true
          },
          `File must be one of ${ACCEPTED_IMAGE_TYPES.join(', ')}`
        )
    )
    .max(maxImages, `You can upload a maximum of ${maxImages} images`)
    .min(1, `You must upload at least ${minImages} image`),
})

export type BaseUserData = z.infer<typeof userSchema> & z.infer<typeof baseUserSchema>

export type RequesterData = z.infer<typeof requesterSchema>

export type InnovatorData = z.infer<typeof innovatorSchema>

export type UserData = BaseUserData & (RequesterData | InnovatorData) & { active: boolean }

export type User = UserData & Models.Document
