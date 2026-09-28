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
  return screen.getByRole('navigation', { name: 'ניווט ראשי' })
}

describe('Home screen', () => {
  it('shows the avatar, the balance and the top-up button', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: 'מסך הבית' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /דמות האווטאר/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /יתרה 1,250/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'הטענה' })).toBeInTheDocument()
  })

  it('renders five nav buttons in spec order with home marked active', () => {
    renderAt('/')
    const links = screen.getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual(['בית', 'ארנק', 'משחקים', 'עוד', 'פרופיל'])
    expect(links[0]).toHaveAttribute('aria-current', 'page')
    links.slice(1).forEach((link) => expect(link).not.toHaveAttribute('aria-current'))
  })

  it('does not navigate when home is tapped while already on home', () => {
    renderAt('/')
    const home = screen.getByRole('link', { name: 'בית' })
    // fireEvent returns false when the default (navigation) was prevented.
    expect(fireEvent.click(home)).toBe(false)
    expect(home).toHaveAttribute('aria-current', 'page')
  })

  it.each([
    ['ארנק', 'ארנק'],
    ['משחקים', 'משחקים'],
    ['עוד', 'עוד'],
    ['פרופיל', 'פרופיל'],
  ])('navigates to %s and marks it active', async (label, heading) => {
    renderAt('/')
    await userEvent.click(screen.getByRole('link', { name: label }))
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'בית' })).not.toHaveAttribute('aria-current')
  })

  it('opens the wallet with top-up intent from the top-up button', async () => {
    renderAt('/')
    await userEvent.click(screen.getByRole('button', { name: 'הטענה' }))
    expect(screen.getByRole('heading', { level: 1, name: 'ארנק' })).toBeInTheDocument()
    expect(screen.getByText('הטענת יתרה')).toBeInTheDocument()
  })

  it('opens the wallet from the balance display', async () => {
    renderAt('/')
    await userEvent.click(screen.getByRole('button', { name: /יתרה 1,250/ }))
    expect(within(getNav()).getByRole('link', { name: 'ארנק' })).toHaveAttribute('aria-current', 'page')
  })
})

describe('Swipe navigation (RTL)', () => {
  function swipe(dx: number, dy = 0) {
    const main = screen.getByRole('main')
    fireEvent.pointerDown(main, { clientX: 200, clientY: 400, isPrimary: true })
    fireEvent.pointerUp(main, { clientX: 200 + dx, clientY: 400 + dy, isPrimary: true })
  }

  beforeAll(() => {
    document.documentElement.dir = 'rtl'
  })

  it('moves to the next tab when swiping right', () => {
    renderAt('/')
    swipe(120)
    expect(screen.getByRole('heading', { level: 1, name: 'ארנק' })).toBeInTheDocument()
  })

  it('moves to the previous tab when swiping left', () => {
    renderAt('/games')
    swipe(-120)
    expect(screen.getByRole('heading', { level: 1, name: 'ארנק' })).toBeInTheDocument()
  })

  it('ignores short or mostly vertical drags and stops at the ends', () => {
    renderAt('/')
    swipe(20)
    swipe(80, 200)
    swipe(-120)
    expect(screen.getByRole('heading', { level: 1, name: 'מסך הבית' })).toBeInTheDocument()
  })
})
