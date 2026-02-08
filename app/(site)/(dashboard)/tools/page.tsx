import { getServices } from '@/server/services'
import { ServiceCards } from '@/components/dashboard/service-card'
import { CreateServiceButton } from '@/components/dashboard/create-service-button'
import { TestServicesButton } from '@/components/dashboard/test-services-button'
import { Loader } from 'lucide-react'
import React, { Suspense } from 'react'

const Page = () => {
    return (
        <Suspense fallback={
            <div className="size-full flex items-center justify-center">
                <Loader className="animate-spin" />
            </div>
        }> 
            <main className="space-y-8 w-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-zinc-700">Services</h1>
                    <div className="flex items-center gap-3">
                        <ServerComponent />
                    </div>
                </div>
                <ServiceComponent />
            </main>
        </Suspense>
    )
}

const ServerComponent = async() => {
    
    const services = await getServices();
    
    return (
        <>
            <TestServicesButton services={services} />
            <CreateServiceButton />
        </>
    )
}

const ServiceComponent = async() => {
    
    const services = await getServices();
    
    return (
        <div className="w-full space-y-8">
            <ServiceCards services={services} />
        </div>
    )
}


export default Page
