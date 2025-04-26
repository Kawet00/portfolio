import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactWindow() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to send message");

      form.reset();
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    className="bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Sending...</span>
                <div className="animate-spin w-4 h-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 border-t border-gray-700 pt-6">
        <h3 className="text-lg font-semibold mb-3">Other Ways to Contact</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full mr-3">
              <i className="ri-mail-line text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-sm">kawet00@proton.me</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full mr-3">
              <i className="ri-discord-line text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-400">Discord</p>
              <p className="text-sm">kawet00</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full mr-3">
              <i className="ri-github-line text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-400">GitHub</p>
              <p className="text-sm">github.com/Kawet00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
