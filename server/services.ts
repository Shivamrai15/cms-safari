import axios from "axios";
import { Service } from "@/types";


export const getServices = async () => {
    try {
        
        const data = await axios.get(`${process.env.NEXT_PUBLIC_MAINTENANCE_SERVER}/services`);
        const services = data.data as Service[];
        return services;

    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
}