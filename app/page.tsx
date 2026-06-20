import { redirect } from "next/navigation"

// The studio home was scratched — it was a wireframe transcription, not a crafted
// composition. For now `/` lands on the advertorial offer page. When the real
// home is designed, replace this redirect with the home route.
export default function Page() {
  redirect("/advertorial")
}
