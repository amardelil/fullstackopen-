import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef(({ buttonLabel, children }, refs) => {
  const [visible, setVisible] = useState(false)
  const hide = () => setVisible(false)
  const show = () => setVisible(true)

  useImperativeHandle(refs, () => ({ hide, show }))

  return (
    <div>
      {!visible && <button onClick={show}>{buttonLabel}</button>}
      {visible && (
        <div className="togglableContent">
          {children}
          <button onClick={hide}>cancel</button>
        </div>
      )}
    </div>
  )
})
Togglable.displayName = 'Togglable'
export default Togglable