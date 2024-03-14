import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

type Props = {
  body: string
}

export const Markdown = ({ body }: Props) => {
  return (
    <ReactMarkdown
      className="[&_]:w-full [&>ul]:ml-2 [&>ol]:ml-2 [&:nth-child(1)]:my-0"
      rehypePlugins={[rehypeRaw]}
      components={{
        blockquote: ({ children }) => (
          <div className="text-gray-500 italic border-l-[6px] pl-4">{children}</div>
        ),
        img: ({ src, alt }) => (
          <a href={src} target="_blank">
            <img src={src} alt={alt ?? ''} className="max-w-full object-contain" />
          </a>
        ),
        a: ({ children, href }) => (
          <Link
            href={href ?? '/'}
            target={href?.startsWith('/') ? '_self' : '_blank'}
            className="text-primary">
            {children}
          </Link>
        ),
        p: ({ children }) => <p className="text-sm my-6">{children}</p>,
        div: ({ children, className, ...props }) => {
          return (
            <div className={`${className} text-sm my-6`} {...props}>
              {children}
            </div>
          )
        },
        ul: ({ children }) => <ul className="list-disc list-inside ml-6">{children}</ul>,
        ol: ({ children }) => (
          <ol className="list-decimal list-inside ml-6">{children}</ol>
        ),
        li: ({ children }) => <li>{children}</li>,
        h1: ({ children }) => (
          <h1 className="border-b text-3xl font-semibold my-4 pt-8 pb-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="border-b text-2xl font-semibold my-4 pt-2 pb-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-2xl font-semibold my-4 pt-4 pb-2">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-xl font-semibold pt-2 pb-2">{children}</h4>
        ),
        h5: ({ children }) => (
          <h5 className="text-lg font-semibold pt-2 pb-2">{children}</h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-md font-semibold pt-2 pb-2">{children}</h6>
        ),
        code({ children }) {
          return <div className="w-full overflow-x-scroll">{children}</div>
        },
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      }}>
      {body}
    </ReactMarkdown>
  )
}
