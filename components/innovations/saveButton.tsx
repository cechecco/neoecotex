'use client'

import { Button } from "@/components/ui/button"
import { useFormStatus } from 'react-dom'

export function SaveButton() {
    const { pending } = useFormStatus()
    return (
        <Button form="innovation-form" type="submit" disabled={pending}>
            Save
        </Button>
    )
}