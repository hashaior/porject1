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
          element={<SectionScreen title="ארנק" description="כאן ניתן יהיה לרכוש מוצרים במשחק, כמפורט באפיון מסך החנות." />}
        />
        <Route
          path="games"
          element={<SectionScreen title="משחקים" description="כאן ניתן יהיה ליצור משחקים ולהשתתף בהם, כמפורט באפיון מסך המשחקים." />}
        />
        <Route
          path="more"
          element={<SectionScreen title="עוד" description="אזור זה יוגדר בהמשך הפרויקט." />}
        />
        <Route
          path="profile"
          element={<SectionScreen title="פרופיל" description="כאן יוצגו פרטי המשתמש והגדרות החשבון, כמפורט באפיון מסך הפרופיל." />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
