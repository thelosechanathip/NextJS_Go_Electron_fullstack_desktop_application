"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useAppStore } from "@/store/useAppStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Schema Validation
const formSchema = z.object({
    hostname: z.string().min(1, "Hostname is required"),
    port: z.string().min(1, "Port is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    database_name: z.string().min(1, "Database Name is required"),
});

export default function DbSetupDialog() {
    const { isDbSetup, checkDbStatus } = useAppStore();
    const [open, setOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        // ถ้ายังไม่ Setup ให้เปิด Dialog
        setOpen(!isDbSetup);
    }, [isDbSetup]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            hostname: "127.0.0.1",
            port: "3306",
            username: "root",
            password: "",
            database_name: "test_db",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setErrorMsg("");
        try {
            // ส่งข้อมูลไปที่ Go Backend
            await axios.post("http://localhost:8080/api/setup", values);
            // ถ้าผ่าน ให้เช็คสถานะใหม่
            await checkDbStatus();
            setOpen(false);
        } catch (error: any) {
            setErrorMsg(error.response?.data?.error || "Connection Failed");
        }
    }

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Database Setup Required</DialogTitle>
                    <DialogDescription>
                        Please configure your MariaDB connection before continuing.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField control={form.control} name="hostname" render={({ field }) => (
                            <FormItem><FormLabel>Hostname</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="flex gap-2">
                            <FormField control={form.control} name="port" render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel>Port</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="database_name" render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel>DB Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="username" render={({ field }) => (
                            <FormItem><FormLabel>Username</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                        <Button type="submit" className="w-full">Test & Save Connection</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}