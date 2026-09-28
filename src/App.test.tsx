import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { App } from './App'

function renderAt(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

function getNav() {
  return screen.getByRole('navigation', { name: 'Main navigation' })
}

describe('Home screen', () => {
  it('shows the avatar, the balance and the top-up button', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Game avatar/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Balance 1,250/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Top up' })).toBeInTheDocument()
  })

  it('renders five icon-only nav buttons in spec order with home marked active', () => {
    renderAt('/')
    const links = within(getNav()).getAllByRole('link')
    expect(links.map((link) => link.getAttribute('aria-label'))).toEqual(['Home', 'Wallet', 'Games', 'More', 'Profile'])
    // Icon-only: no visible text in the dock.
    links.forEach((link) => expect(link.textContent).toBe(''))
    expect(links[0]).toHaveAttribute('aria-current', 'page')
    links.slice(1).forEach((link) => expect(link).not.toHaveAttribute('aria-current'))
  })

  it('does not navigate when home is tapped while already on home', () => {
    renderAt('/')
    const home = screen.getByRole('link', { name: 'Home' })
    // fireEvent returns false when the default (navigation) was prevented.
    expect(fireEvent.click(home)).toBe(false)
    expect(home).toHaveAttribute('aria-current', 'page')
  })

  it.each([
    ['Wallet', 'Wallet'],
    ['Games', 'Games'],
    ['More', 'More'],
    ['Profile', 'Profile'],
  ])('navigates to %s and marks it active', async (label, heading) => {
    renderAt('/')
    await userEvent.click(screen.getByRole('link', { name: label }))
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
  })

  it('opens the wallet with top-up intent from the top-up button', async () => {
    renderAt('/')
    await userEvent.click(screen.getByRole('button', { name: 'Top up' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Wallet' })).toBeInTheDocument()
    expect(screen.getByText('Top up balance')).toBeInTheDocument()
  })

  it('opens the wallet from the balance display', async () => {
    renderAt('/')
    await userEvent.click(screen.getByRole('button', { name: /Balance 1,250/ }))
    expect(within(getNav()).getByRole('link', { name: 'Wallet' })).toHaveAttribute('aria-current', 'page')
  })
})

describe('Swipe navigation (LTR)', () => {
  function swipe(dx: number, dy = 0) {
    const main = screen.getByRole('main')
    fireEvent.pointerDown(main, { clientX: 200, clientY: 400, isPrimary: true })
    fireEvent.pointerUp(main, { clientX: 200 + dx, clientY: 400 + dy, isPrimary: true })
  }

  beforeAll(() => {
    document.documentElement.dir = 'ltr'
  })

  it('moves to the next tab when swiping left', () => {
    renderAt('/')
    swipe(-120)
    expect(screen.getByRole('heading', { level: 1, name: 'Wallet' })).toBeInTheDocument()
  })

  it('moves to the previous tab when swiping right', () => {
    renderAt('/games')
    swipe(120)
    expect(screen.getByRole('heading', { level: 1, name: 'Wallet' })).toBeInTheDocument()
  })

  it('ignores short or mostly vertical drags and stops at the ends', () => {
    renderAt('/')
    swipe(20)
    swipe(-80, 200)
    swipe(120)
    expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeInTheDocument()
  })
})
