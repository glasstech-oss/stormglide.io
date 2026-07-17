import { motion, useReducedMotion } from 'framer-motion'

/**
 * WordReveal - staggered word-by-word rise reveal for statement headlines.
 * Each word rises from behind an overflow-hidden mask when scrolled into view.
 * Renders as the given tag (default h2) so existing heading CSS applies.
 */
export default function WordReveal({ text, as: Tag = 'h2', className, style, delay = 0 }) {
  const reduceMotion = useReducedMotion()
  const words = String(text).split(' ')
  const MotionTag = motion[Tag] ?? motion.h2

  if (reduceMotion) {
    return <Tag className={className} style={style}>{text}</Tag>
  }

  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ staggerChildren: 0.028, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.08em', marginBottom: '-0.08em', marginRight: i < words.length - 1 ? '0.26em' : 0 }}
        >
          <motion.span
            style={{ display: 'inline-block', willChange: 'transform' }}
            variants={{
              hidden: { y: '112%' },
              visible: { y: '0%', transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}
