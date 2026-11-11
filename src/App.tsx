import { Route, Routes } from 'react-router-dom'
import AcademyLayout from './academy/AcademyLayout'
import AcademyHome from './academy/pages/AcademyHome'
import Browse from './academy/pages/Browse'
import Certificate, { Verify } from './academy/pages/Certificate'
import CourseDetail from './academy/pages/CourseDetail'
import { InstitutionAdmin, InstitutionsLanding } from './academy/pages/Institutions'
import InstructorProfile from './academy/pages/InstructorProfile'
import Learn from './academy/pages/Learn'
import MyLearning from './academy/pages/MyLearning'
import ProgramDetail from './academy/pages/ProgramDetail'
import { CourseBuilder, TeachDashboard, TeachLanding } from './academy/pages/Teach'
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
      <Route path="academy" element={<AcademyLayout />}>
        <Route index element={<AcademyHome />} />
        <Route path="browse" element={<Browse />} />
        <Route path="course/:slug" element={<CourseDetail />} />
        <Route path="program/:slug" element={<ProgramDetail />} />
        <Route path="learn/:slug" element={<Learn />} />
        <Route path="learn/:slug/:lessonId" element={<Learn />} />
        <Route path="my-learning" element={<MyLearning />} />
        <Route path="certificate/:code" element={<Certificate />} />
        <Route path="verify" element={<Verify />} />
        <Route path="instructor/:id" element={<InstructorProfile />} />
        <Route path="teach" element={<TeachLanding />} />
        <Route path="teach/dashboard" element={<TeachDashboard />} />
        <Route path="teach/new" element={<CourseBuilder />} />
        <Route path="teach/edit/:slug" element={<CourseBuilder />} />
        <Route path="institutions" element={<InstitutionsLanding />} />
        <Route path="institutions/admin" element={<InstitutionAdmin />} />
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
