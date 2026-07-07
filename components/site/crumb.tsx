import Link from "next/link"

/** The mono breadcrumb opening every detail page — the leading segment
 * carries the type's identity colour, the leaf sits in ink at 50%. */
export function Crumb({
  typeLabel,
  typeHref,
  typeColor,
  leaf,
}: {
  typeLabel: string
  typeHref: string
  typeColor: string
  leaf: string
}) {
  return (
    <p className="dt-crumb an-in">
      <Link href={typeHref} className="dt-crumb-type" style={{ color: typeColor }}>
        {typeLabel}
      </Link>
      <span className="dt-crumb-sep" aria-hidden>
        /
      </span>
      <span className="dt-crumb-leaf">{leaf}</span>
    </p>
  )
}
