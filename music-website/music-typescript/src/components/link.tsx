import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { AnchorHTMLAttributes, forwardRef } from 'react'
import { styled } from '@mui/material'

// Add support for the sx prop for consistency with the other branches.
const Anchor = styled('a')({})

interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    Omit<NextLinkProps, 'onClick' | 'onMouseEnter'> {}

// eslint-disable-next-line react/display-name
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, as, replace, scroll, shallow, prefetch, locale, ...other }, ref) => {
    return (
      <NextLink
        href={href}
        prefetch={prefetch}
        as={as}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref
        locale={locale}
      >
        <Anchor ref={ref} {...other} />
      </NextLink>
    )
  }
)
