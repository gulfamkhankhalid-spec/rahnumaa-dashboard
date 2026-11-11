import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import SiteLayout from './components/SiteLayout'
import Assessments from './pages/app/Assessments'
import Counselors from './pages/app/Counselors'
import Dashboard from './pages/app/Dashboard'
import Explore from './pages/app/Explore'
import Launcher from './pages/app/Launcher'
import Plan from './pages/app/Plan'
import Record from './pages/app/Record'
import Abc from './pages/site/Abc'
import Auth from './pages/site/Auth'
import Guidance from './pages/site/Guidance'
import Home from './pages/site/Home'
import Initiative from './pages/site/Initiative'
import NotFound from './pages/site/NotFound'
import Partners from './pages/site/Partners'
import Pilot from './pages/site/Pilot'
import Roadmap from './pages/site/Roadmap'
import Skillsrator from './pages/site/Skillsrator'
import Trust from './pages/site/Trust'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="skillsrator" element={<Skillsrator />} />
        <Route path="skillsrator/:slug" element={<Initiative />} />
        <Route path="guidance" element={<Guidance />} />
        <Route path="abc" element={<Abc />} />
        <Route path="pilot" element={<Pilot />} />
        <Route path="partners" element={<Partners />} />
        <Route path="trust" element={<Trust />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="login" element={<Auth mode="login" />} />
        <Route path="signup" element={<Auth mode="signup" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="app" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="plan" element={<Plan />} />
        <Route path="explore" element={<Explore />} />
        <Route path="counselors" element={<Counselors />} />
        <Route path="skillsrator" element={<Launcher />} />
        <Route path="record" element={<Record />} />
      </Route>
    </Routes>
  )
}
