"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Globe,
  Clock,
  AlertCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Service } from "@/types";
import { cn } from "@/lib/utils";

interface ServiceStatus {
  service: Service;
  status: 'pending' | 'testing' | 'up' | 'down' | 'error';
  responseTime?: number;
  error?: string;
}

interface TestServicesButtonProps {
  services: Service[];
}

export const TestServicesButton = ({ services }: TestServicesButtonProps) => {
  const [open, setOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>([]);

  const testService = async (service: Service): Promise<ServiceStatus> => {
    const startTime = Date.now();
    
    try {
      const response = await axios.get(service.url, {
        timeout: 15000,
        validateStatus: () => true, // Accept all status codes
        headers: {
          'Accept': 'application/json',
        },
      });
      
      const responseTime = Date.now() - startTime;
      
      // Check if response is successful (2xx or 3xx status codes)
      const isHealthy = response.status >= 200 && response.status < 400;
      
      // Additional check: if response has a "status" field indicating health
      const hasHealthyStatus = 
        response.data && 
        typeof response.data === 'object' && 
        (response.data.status === 'healthy' || response.data.status === 'ok');
      
      return {
        service,
        status: (isHealthy || hasHealthyStatus) ? 'up' : 'down',
        responseTime,
        error: !isHealthy && !hasHealthyStatus ? `HTTP ${response.status}` : undefined,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      let errorMessage = 'Unknown error';
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timeout';
        } else if (error.code === 'ERR_NETWORK') {
          errorMessage = 'Network error (CORS or unreachable)';
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      
      return {
        service,
        status: 'error',
        responseTime,
        error: errorMessage,
      };
    }
  };

  const runTests = async () => {
    if (services.length === 0) {
      toast.error("No services to test");
      return;
    }

    setIsTesting(true);
    
    // Initialize all services with pending status
    const initialStatuses: ServiceStatus[] = services.map(service => ({
      service,
      status: 'pending',
    }));
    setServiceStatuses(initialStatuses);

    // Test each service one by one
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      
      // Set current service to testing
      setServiceStatuses(prev => 
        prev.map((status, index) => 
          index === i ? { ...status, status: 'testing' } : status
        )
      );

      // Test the service
      const result = await testService(service);
      
      // Update with result
      setServiceStatuses(prev => 
        prev.map((status, index) => 
          index === i ? result : status
        )
      );

      // Small delay between tests for better UX
      if (i < services.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    setIsTesting(false);
    
    const upCount = serviceStatuses.filter(s => s.status === 'up').length;
    const downCount = serviceStatuses.filter(s => s.status === 'down' || s.status === 'error').length;
    
    toast.success("Service tests completed", {
      description: `${upCount} up, ${downCount} down`,
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && serviceStatuses.length === 0) {
      // Auto-start testing when modal opens
      setTimeout(() => runTests(), 500);
    }
  };

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-neutral-400" />;
      case 'testing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'up':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'down':
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'pending':
        return 'Waiting...';
      case 'testing':
        return 'Testing...';
      case 'up':
        return 'Online';
      case 'down':
        return 'Offline';
      case 'error':
        return 'Error';
    }
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-neutral-50 border-neutral-200';
      case 'testing':
        return 'bg-blue-50 border-blue-200 animate-pulse';
      case 'up':
        return 'bg-green-50 border-green-200';
      case 'down':
      case 'error':
        return 'bg-red-50 border-red-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Activity className="h-4 w-4" />
          Test Services
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-neutral-600" />
            Service Health Check
          </DialogTitle>
          <DialogDescription>
            Testing connectivity and response time for all services
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-neutral-400 mb-3" />
              <p className="text-sm text-muted-foreground">
                No services available to test
              </p>
            </div>
          ) : serviceStatuses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">
                Initializing tests...
              </p>
            </div>
          ) : (
            serviceStatuses.map((statusItem, index) => (
              <div
                key={statusItem.service.id}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-300",
                  getStatusColor(statusItem.status)
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5">
                      {getStatusIcon(statusItem.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-neutral-900 mb-1">
                        {statusItem.service.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <Globe className="h-3 w-3" />
                        <span className="truncate">{statusItem.service.url}</span>
                      </div>
                      {statusItem.error && (
                        <p className="text-xs text-red-600 mt-1">
                          {statusItem.error}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        statusItem.status === 'up' && "bg-green-100 text-green-700",
                        statusItem.status === 'testing' && "bg-blue-100 text-blue-700",
                        (statusItem.status === 'down' || statusItem.status === 'error') && "bg-red-100 text-red-700",
                        statusItem.status === 'pending' && "bg-neutral-100 text-neutral-600"
                      )}
                    >
                      {getStatusText(statusItem.status)}
                    </span>
                    {statusItem.responseTime !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {statusItem.responseTime}ms
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar for testing state */}
                {statusItem.status === 'testing' && (
                  <div className="mt-3 h-1 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 animate-progress-bar" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t mt-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>
                {serviceStatuses.filter(s => s.status === 'up').length} Online
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <XCircle className="h-4 w-4 text-red-500" />
              <span>
                {serviceStatuses.filter(s => s.status === 'down' || s.status === 'error').length} Offline
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isTesting}
            >
              Close
            </Button>
            <Button
              onClick={runTests}
              disabled={isTesting || services.length === 0}
              className="gap-2"
            >
              {isTesting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4" />
                  Run Tests Again
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>

      <style jsx>{`
        @keyframes progress-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-progress-bar {
          animation: progress-bar 1s ease-in-out infinite;
        }
      `}</style>
    </Dialog>
  );
};