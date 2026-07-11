import Script from "next/script"

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"

/**
 * Optional PostHog capture. Dormant unless NEXT_PUBLIC_POSTHOG_KEY is present,
 * so channel47 can keep Vercel Analytics as the default lightweight source and
 * enable PostHog later without another code change.
 */
export function PostHogAnalytics() {
  if (!key) return null

  const apiKey = JSON.stringify(key)
  const config = JSON.stringify({
    api_host: host,
    person_profiles: "identified_only",
  })

  return (
    <Script
      id="posthog-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"};o="init capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group get_group identify".split(" ");for(n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init(${apiKey}, ${config});
        `,
      }}
    />
  )
}
