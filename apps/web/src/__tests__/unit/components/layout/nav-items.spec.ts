import { bottomNavItems, navItems } from '@/components/layout/nav-items'
import { ROUTES } from '@/util/routes'

describe('navItems', () => {
  it('should have the correct number of items', () => {
    expect(navItems).toHaveLength(6)
  })

  it('should have correct hrefs', () => {
    const hrefs = navItems.map((i) => i.href)
    expect(hrefs).toEqual([
      ROUTES.DASHBOARD,
      ROUTES.TRANSACTIONS,
      ROUTES.BUDGET,
      ROUTES.CATEGORIES,
      ROUTES.GOALS,
      ROUTES.STATS,
    ])
  })

  it('should have a labelKey for every item', () => {
    for (const item of navItems) {
      expect(item.labelKey).toMatch(/^sidebar\./)
    }
  })

  it('should have an icon component for every item', () => {
    for (const item of navItems) {
      expect(item.icon).toBeDefined()
    }
  })
})

describe('bottomNavItems', () => {
  it('should have the correct number of items', () => {
    expect(bottomNavItems).toHaveLength(2)
  })

  it('should have settings and profile hrefs', () => {
    const hrefs = bottomNavItems.map((i) => i.href)

    expect(hrefs).toContain(ROUTES.SETTINGS)
    expect(hrefs).toContain(ROUTES.PROFILE)
  })
})

describe('all nav items', () => {
  it('should have unique hrefs across both arrays', () => {
    const allHrefs = [...navItems, ...bottomNavItems].map((i) => i.href)

    expect(new Set(allHrefs).size).toBe(allHrefs.length)
  })
})
