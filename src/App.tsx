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
import MagnetsLayout from './magnets/MagnetsLayout'
import MagnetsDiscover from './magnets/pages/Discover'
import MagnetsHome from './magnets/pages/Home'
import MagnetPage from './magnets/pages/MagnetPage'
import { Admin as MagnetsAdmin, Chats, NewMagnet, Notifications, PostPage, Profile } from './magnets/pages/More'
import SdcLayout from './sdc/SdcLayout'
import Classroom, { ItemView } from './sdc/pages/Classroom'
import { Assessment, Calendar, Certificate as SdcCertificate, Guardian, Verify as SdcVerify } from './sdc/pages/Extras'
import SdcLearn from './sdc/pages/Learn'
import SdcHome from './sdc/pages/SdcHome'
import SkillDetail from './sdc/pages/SkillDetail'
import SdcSkills from './sdc/pages/Skills'
import { Centre, CohortAdmin, Instructor, NewCohort } from './sdc/pages/Staff'
import LancerLayout from './lancer/LancerLayout'
import { ClientDashboard, ClientProject } from './lancer/pages/Client'
import { ContractPage, OrderPage } from './lancer/pages/Deal'
import GigBuilder from './lancer/pages/GigBuilder'
import GigDetail from './lancer/pages/GigDetail'
import Gigs from './lancer/pages/Gigs'
import HowItWorks from './lancer/pages/HowItWorks'
import LancerHome from './lancer/pages/LancerHome'
import Messages from './lancer/pages/Messages'
import PostProject from './lancer/pages/PostProject'
import SellerDashboard from './lancer/pages/Seller'
import { FreelancerProfile, Talent } from './lancer/pages/Talent'
import Wallet from './lancer/pages/Wallet'
import { FindWork, ProjectDetail } from './lancer/pages/Work'
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
      <Route path="lancer" element={<LancerLayout />}>
        <Route index element={<LancerHome />} />
        <Route path="gigs" element={<Gigs />} />
        <Route path="gig/:id" element={<GigDetail />} />
        <Route path="talent" element={<Talent />} />
        <Route path="u/:id" element={<FreelancerProfile />} />
        <Route path="post" element={<PostProject />} />
        <Route path="client" element={<ClientDashboard />} />
        <Route path="client/project/:id" element={<ClientProject />} />
        <Route path="projects" element={<FindWork />} />
        <Route path="project/:id" element={<ProjectDetail />} />
        <Route path="seller" element={<SellerDashboard />} />
        <Route path="seller/gig/new" element={<GigBuilder />} />
        <Route path="seller/gig/:id" element={<GigBuilder />} />
        <Route path="order/:id" element={<OrderPage />} />
        <Route path="contract/:id" element={<ContractPage />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:threadId" element={<Messages />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="sdc" element={<SdcLayout />}>
        <Route index element={<SdcHome />} />
        <Route path="skills" element={<SdcSkills />} />
        <Route path="skill/:id" element={<SkillDetail />} />
        <Route path="learn" element={<SdcLearn />} />
        <Route path="class/:enrolId" element={<Classroom />} />
        <Route path="class/:enrolId/item/:itemId" element={<ItemView />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="assessment" element={<Assessment />} />
        <Route path="certificate/:code" element={<SdcCertificate />} />
        <Route path="verify" element={<SdcVerify />} />
        <Route path="guardian" element={<Guardian />} />
        <Route path="instructor" element={<Instructor />} />
        <Route path="instructor/cohort/:id" element={<CohortAdmin />} />
        <Route path="instructor/new" element={<NewCohort />} />
        <Route path="centre" element={<Centre />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="magnets" element={<MagnetsLayout />}>
        <Route index element={<MagnetsHome />} />
        <Route path="discover" element={<MagnetsDiscover />} />
        <Route path="m/:id" element={<MagnetPage />} />
        <Route path="new" element={<NewMagnet />} />
        <Route path="p/:id" element={<PostPage />} />
        <Route path="chats" element={<Chats />} />
        <Route path="chats/:threadId" element={<Chats />} />
        <Route path="me" element={<Profile self />} />
        <Route path="u/:id" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="admin" element={<MagnetsAdmin />} />
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
