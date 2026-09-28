import { Navigate, Route, Routes } from 'react-router'
import { AppShell } from './layout/AppShell'
import { HomeScreen } from './screens/HomeScreen/HomeScreen'
import { SectionScreen } from './screens/SectionScreen/SectionScreen'

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomeScreen />} />
        <Route
          path="wallet"
          element={<SectionScreen title="Wallet" description="Buy in-game items here, as defined in the store screen spec." />}
        />
        <Route
          path="games"
          element={<SectionScreen title="Games" description="Create and join games here, as defined in the games screen spec." />}
        />
        <Route
          path="more"
          element={<SectionScreen title="More" description="This area will be defined later in the project." />}
        />
        <Route
          path="profile"
          element={<SectionScreen title="Profile" description="Your details and account settings will appear here, as defined in the profile screen spec." />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
