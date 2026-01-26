"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

type ContactFormProps = {
    dict: any;
    lang: string;
};

export function ContactForm({ dict, lang }: ContactFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message"),
        };

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            setIsSuccess(true);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in">
                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <Send className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{dict.contact.form.success}</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                    {lang === 'bg'
                        ? "Благодарим ви за запитването. Ще се свържем с вас възможно най-скоро."
                        : "Thank you for your message. We will contain you as soon as possible."}
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-6">
                    {lang === 'bg' ? "Изпрати ново съобщение" : "Send another message"}
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-700">
                        {dict.contact.form.name}
                    </label>
                    <Input
                        id="name"
                        name="name"
                        required
                        placeholder={lang === 'bg' ? "Иван Иванов" : "John Doe"}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700">
                        {dict.contact.form.email}
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder={lang === 'bg' ? "ivan@example.com" : "john@example.com"}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-700">
                    {dict.contact.form.message}
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    className="flex min-h-[160px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={lang === 'bg' ? "Как можем да ви помогнем?" : "How can we help?"}
                ></textarea>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-6 text-lg font-bold"
            >
                {isLoading ? (lang === 'bg' ? "Изпращане..." : "Sending...") : dict.contact.form.submit}
                {!isLoading && <Send className="ml-2 h-5 w-5" />}
            </Button>
        </form>
    );
}
