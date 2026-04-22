import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />)
    expect(screen.getByText('Menú Digital QR')).toBeDefined()
  })

  it('renders the description', () => {
    render(<App />)
    expect(
      screen.getByText('Sistema de menú digital para restaurantes')
    ).toBeDefined()
  })
})
