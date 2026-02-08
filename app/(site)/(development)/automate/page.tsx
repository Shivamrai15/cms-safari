import { AutomateForm } from '@/components/development/form/automate-form'
import React from 'react'

const Page = () => {
    return (
        <div className="flex flex-col items-center py-10 space-y-10" >
            <div className="w-full text-left max-w-md space-y-2">
                <h1 className="text-2xl font-bold text-zinc-800">Audio Ingestion</h1>
                <p className="text-sm text-zinc-700">The automation searches and selects required albums, collects data from the Saavn API, processes metadata, generates embeddings, and converts audio files into HLS format.</p>
            </div>
            <AutomateForm/>
        </div>
    )
}

export default Page
