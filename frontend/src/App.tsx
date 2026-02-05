import { Routes, Route } from 'react-router-dom'
import { Suspense, useEffect } from 'react'
import { publicRoutes } from './routes/publicRoutes'
import { privateRoutes } from './routes/privateRoutes'
import Loader from './components/ui-elements/Loader'
import { SafeRoute } from './components/SafeRouter'
import NotFound from './pages/NotFound'
import { useAuthStore } from './stores/authStore'
import CustomOutlet from './components/CustomOutlet'
import AuthOutlet from './components/AuthOutlet'


function App() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const {accessToken, fetchMe} = useAuthStore();
  useEffect(() => {
    if(accessToken){
      fetchMe();
    }
    hydrate();
  }, [hydrate, fetchMe, accessToken]);
  return (
    <div className='main'>
      <Suspense fallback={<div><Loader /></div>}>
        <Routes>
          <Route element={<SafeRoute><CustomOutlet /></SafeRoute>}>
            {privateRoutes.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}

            {/* Protected wildcard (authenticated users) */}
            <Route key="notfound-protected" path="*" element={<NotFound />} />
          </Route>

          <Route element={<AuthOutlet />}>
            {publicRoutes.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>

          {/* Public wildcard (all other unmatched routes) */}
          <Route key="notfound-public" path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
