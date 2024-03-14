interface Props {
  className?: string
  children: React.ReactNode
}

const Container = ({ children, className }: Props) => {
  return (
    <div className={`mx-auto whitespace-normal overflow-auto break-words ${className}`}>
      {children}
    </div>
  )
}

export default Container
