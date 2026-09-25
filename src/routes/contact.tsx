import { createFileRoute } from "@tanstack/react-router";

import ContactPage from "@/src/pages/contact";

export const Route = createFileRoute("/contact")({ component: ContactPage });
