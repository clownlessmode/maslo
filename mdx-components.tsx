import React, { ComponentPropsWithoutRef } from "react"
import Link from "next/link"

type HeadingProps = ComponentPropsWithoutRef<"h1">
type ParagraphProps = ComponentPropsWithoutRef<"p">
type ListProps = ComponentPropsWithoutRef<"ul">
type ListItemProps = ComponentPropsWithoutRef<"li">
type AnchorProps = ComponentPropsWithoutRef<"a">
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">

const components = {
  h1: (props: HeadingProps) => (
    <h1
      className="font-medium xl:text-xl lg:text-lg text-md sm:text-2xl xl:leading-[28px] lg:leading-[25px] sm:leading-[33px] leading-[19.6px] pt-12 mb-0 fade-in"
      {...props}
    />
  ),
  h2: (props: HeadingProps) => (
    <h2
      className="xl:text-xl lg:text-lg text-md sm:text-2xl xl:leading-[28px] lg:leading-[25px] sm:leading-[33px] leading-[19.6px] font-medium mt-8 mb-3"
      {...props}
    />
  ),
  h3: (props: HeadingProps) => (
    <h3
      className="xl:text-xl lg:text-lg text-md sm:text-2xl xl:leading-[28px] lg:leading-[25px] sm:leading-[33px] leading-[19.6px] font-medium mt-8 mb-3"
      {...props}
    />
  ),
  h4: (props: HeadingProps) => <h4 className="font-medium" {...props} />,
  p: (props: ParagraphProps) => (
    <p
      className="xl:text-xl lg:text-lg text-md sm:text-2xl xl:leading-[28px] lg:leading-[25px] sm:leading-[33px] leading-[19.6px] pt-3"
      {...props}
    />
  ),
  ol: (props: ListProps) => (
    <ol
      className="xl:text-xl lg:text-lg text-md sm:text-2xl xl:leading-[28px] lg:leading-[25px] sm:leading-[33px] leading-[19.6px] list-decimal pl-5 space-y-2"
      {...props}
    />
  ),
  ul: (props: ListProps) => (
    <ul
      className="xl:text-xl lg:text-lg text-md sm:text-2xl xl:leading-[28px] lg:leading-[25px] sm:leading-[33px] leading-[19.6px] list-disc pl-5 space-y-1"
      {...props}
    />
  ),
  li: (props: ListItemProps) => <li className="pl-1" {...props} />,
  em: (props: ComponentPropsWithoutRef<"em">) => (
    <em className="font-medium" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-medium" {...props} />
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    const baseClassName =
      "text-brand relative inline-block after:absolute after:bottom-0 after:left-0 after:h-px after:bg-brand after:transition-all after:duration-300"
    const hoverClassName =
      "after:w-0 hover:after:w-full after:right-0 after:left-auto hover:after:left-0 hover:after:right-auto"

    const className = `${baseClassName} ${hoverClassName}`

    if (href?.startsWith("/")) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      )
    }
    if (href?.startsWith("#")) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      )
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    )
  },
  Table: ({ data }: { data: { headers: string[]; rows: string[][] } }) => (
    <table>
      <thead>
        <tr>
          {data.headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  blockquote: (props: BlockquoteProps) => (
    <blockquote
      className="ml-[0.075em] border-l-3 border-gray-300 pl-4 text-gray-700"
      {...props}
    />
  ),
}

declare global {
  type MDXProvidedComponents = typeof components
}

export function useMDXComponents(): MDXProvidedComponents {
  return components
}
