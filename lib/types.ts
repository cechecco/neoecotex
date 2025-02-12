export interface InnovationRequest {
  title: string;
  company: string;
  briefDescription: string;
  detailedDescription: string;
  expectedExpertise: string;
  expectedTimeline: string;
  budget: number;
  concept: string;
  field: string;
  marketingConsent: boolean;
  ecologyConsent: boolean;
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
} 

export interface EditableInnovationRequestProps {
  request: InnovationRequest;
  isEditing: boolean;
  onSave: (request: InnovationRequest) => Promise<void>;
  onCancel: () => void;
}