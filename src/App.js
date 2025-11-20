import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { AuthContext, AuthProvider } from "./context/AuthContext";

// Import screens
import Loginpage from "./pages/AuthPage/LoginPage";
import Recovery from "./pages/AuthPage/RecoveryPage";
import SigninPage from "./pages/AuthPage/SigninPage";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./components/Profile/Profile";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import NewsPage1 from "./pages/NewsPage/NewsPage1";
import DistrictList from "./pages/DistrictPage/DistrictPage2";
import NewsPage2 from "./pages/NewsPage/NewsPage2";
import Membership from "./pages/MembersPage/Member";
import EventPage2 from "./components/Events/EventPage2";
import Gallery from "./pages/GalleryPage/GalleryPage2";
import charities1 from "./components/Charities/CharitiesPage1";
import Charities2 from "./components/Charities/CharitiesPage2";
import Complaintpage from "./components/ComplainPage/ComplainPage1";
import NewComplain from "./components/ComplainPage/NewComplain";
import ComplaintScreen from "./components/ComplainPage/ComplainDetails";
import Sidebar from "./components/Sidebar/Sidebar";
import GalleryFull from "./pages/GalleryPage/GalleryFull";
import Membership1 from "./pages/MembersPage/Member1";
import AboutPage1 from "./pages/AboutPage/AboutPage1";
import AboutPage2 from   "./pages/AboutPage/AboutPage2";
import DistrictCategorysPage1 from "./pages/DistrictCategorysPage/DistrictCategorysPage1";
import DistrictCategorysPage2 from "./pages/DistrictCategorysPage/DistrictCategorysPage2";
import InterviewPage1 from "./pages/InterviewPage/InterviewPage1";
import InterviewPage2 from "./pages/InterviewPage/InterviewPage2";
import DistrictCategorysPage0 from "./pages/DistrictCategorysPage/DistrictCategorysPage0";
import ElectionPage from "./pages/ElectionPage/ElectionPage";
import HistoryPge1 from "./pages/ElectionCategorysPage/HistoryPage/HistoryPage1";
import HistoryPage1 from "./pages/ElectionCategorysPage/HistoryPage/HistoryPage1";
import HistoryPage2 from "./pages/ElectionCategorysPage/HistoryPage/HistoryPage2";
import HistoryPage3 from "./pages/ElectionCategorysPage/HistoryPage/HistoryPage3";
import StoryPage1 from "./pages/ElectionCategorysPage/StoryPage/StoryPage1";
import StoryPage2 from "./pages/ElectionCategorysPage/StoryPage/StoryPage2";
import PoojaPage1 from "./pages/ElectionCategorysPage/PoojaPage/PoojaPage1";
import PoojaPage2 from "./pages/ElectionCategorysPage/PoojaPage/PoojaPage2l";
import LeaderPage1 from "./pages/ElectionCategorysPage/LeaderPage/LeaderPage1";
import LeaderPage2 from "./pages/ElectionCategorysPage/LeaderPage/LeaderPage2";
import LeaderPage3 from "./pages/ElectionCategorysPage/LeaderPage/LeaderPage3";
import TourismPage1 from "./pages/ElectionCategorysPage/TourismPage/TourismPage1";
import TourismPage2 from "./pages/ElectionCategorysPage/TourismPage/TourismPage2";
import VaasthuPage from "./pages/ElectionCategorysPage/VaasthuPage/VaasthuPage";
import ElectionVotePage1 from "./pages/ElectionCategorysPage/ElectionVotePage/ElectionVotePage1";
import ElectionVotePage2 from "./pages/ElectionCategorysPage/ElectionVotePage/ElectionVotePage2";
import AstrologyPage1 from "./pages/ElectionCategorysPage/AstrologyPage/AstrologyPage1";
import AstrologyPage2 from "./pages/ElectionCategorysPage/AstrologyPage/AstrologyPage2";
import AstrologyPage3 from "./pages/ElectionCategorysPage/AstrologyPage/AstrologyPage3";
import TourismPage3 from "./pages/ElectionCategorysPage/TourismPage/TourismPage3";
import Member0 from "./pages/MembersPage/Member0";
import GovernmentPage2 from "./pages/DistrictPage/Government/GovernmentPage2";
import TownPage1 from "./pages/DistrictPage/TownPage/TownPage1";
import TownPage2 from "./pages/DistrictPage/TownPage/TownPage2";
import GovernmentPage from "./pages/DistrictPage/Government/GovernmentPage1";
import PartiesPage1 from "./pages/DistrictPage/Parties/PartiesPage1.js";
import PartiesPage2 from "./pages/DistrictPage/Parties/PartiesPage2";
import TownBusinessPage from "./pages/DistrictPage/TownPage/BusinessTownPage/TownBusinessPage.js";
import TownBusinessPage1 from "./pages/DistrictPage/TownPage/BusinessTownPage/TownBusinessPage1.js";
import TownBusinessPage2 from "./pages/DistrictPage/TownPage/BusinessTownPage/TownBusinessPage2.js";
import TownBusinessPage3 from "./pages/DistrictPage/TownPage/BusinessTownPage/TownBusinessPage3.js";


const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();

// Footer wrapper
const withFooter = (Component) => (props) => (
  <>
    <Component {...props} />
    <Footer />
  </>
);
const withHeaderAndFooter = (Component) => (props) => (
  <>
    <Component {...props} />
    <Footer />
  </>
);

function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={Loginpage} />
      <AuthStack.Screen name="Recovery" component={Recovery} />
      <AuthStack.Screen name="Signup" component={SigninPage} />
    </AuthStack.Navigator>
  );
}

function MainStackScreen() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="HomePage" component={withHeaderAndFooter(HomePage)} />
    <MainStack.Screen name="Sidebar" component={withHeaderAndFooter(Sidebar)} />
    <MainStack.Screen name="Profile" component={withFooter(ProfilePage)} />
    <MainStack.Screen name="Member" component={withFooter(Membership)}/>
    <MainStack.Screen name="Member1" component={withFooter(Membership1)}/>
    <MainStack.Screen name="NewsPage1" component={withFooter(NewsPage1)}/>
    <MainStack.Screen name="Newspage2" component={withFooter(NewsPage2)}/>
    <MainStack.Screen name="DistrictPage2" component={withFooter(DistrictList)}/>
    <MainStack.Screen name="EventPage2" component={withFooter(EventPage2)}/>
    <MainStack.Screen name="GalleryPage2" component={withFooter(Gallery)}/>
    <MainStack.Screen name="Galleryfull" component={withFooter(GalleryFull)}/>
    <MainStack.Screen name="CharitiePage1" component={withFooter(charities1)}/>
    <MainStack.Screen name="CharitiesPage2" component={withFooter(Charities2)}/>
    <MainStack.Screen name="ComplainPage1" component={withFooter(Complaintpage)}/>
    <MainStack.Screen name="NewComplain" component={withFooter(NewComplain)}/>
    <MainStack.Screen name="ComplainDetails" component={withFooter(ComplaintScreen)}/>
    <MainStack.Screen name="AboutPage1" component={withFooter(AboutPage1)}/>
    <MainStack.Screen name="AboutPage2" component={withFooter(AboutPage2)}/>
    <MainStack.Screen name="DistrictCategorysPage0" component={withFooter(DistrictCategorysPage0)}/>
    <MainStack.Screen name="DistrictCategorysPage1" component={withFooter(DistrictCategorysPage1)}/>
    <MainStack.Screen name="DistrictCategorysPage2" component={withFooter(DistrictCategorysPage2)}/>
    <MainStack.Screen name="InterviewPage1" component={withFooter(InterviewPage1)}/>
    <MainStack.Screen name="InterviewPage2" component={withFooter(InterviewPage2)}/>
    <MainStack.Screen name="ElectionPage" component={withFooter(ElectionPage)}/>
    <MainStack.Screen name="HistoryPage1" component={withFooter(HistoryPage1)}/>
    <MainStack.Screen name="HistoryPage2" component={withFooter(HistoryPage2)}/>
    <MainStack.Screen name="HistoryPage3" component={withFooter(HistoryPage3)}/>
    <MainStack.Screen name="StoryPage1" component={withFooter(StoryPage1)}/>
    <MainStack.Screen name="StoryPage2" component={withFooter(StoryPage2)}/>
    <MainStack.Screen name="PoojaPage1" component={withFooter(PoojaPage1)}/>
    <MainStack.Screen name="PoojaPage2" component={withFooter(PoojaPage2)}/>
    <MainStack.Screen name="LeaderPage1" component={withFooter(LeaderPage1)}/> 
    <MainStack.Screen name="LeaderPage2" component={withFooter(LeaderPage2)}/>
    <MainStack.Screen name="LeaderPage3" component={withFooter(LeaderPage3)}/>
    <MainStack.Screen name="TourismPage1" component={withFooter(TourismPage1)}/>
    <MainStack.Screen name="TourismPage2" component={withFooter(TourismPage2)}/>
    <MainStack.Screen name="TourismPage3" component={withFooter(TourismPage3)}/>
    <MainStack.Screen name="VaasthuPage" component={withFooter(VaasthuPage)}/>
    <MainStack.Screen name="ElectionVotePage1" component={withFooter(ElectionVotePage1)}/>
    <MainStack.Screen name="ElectionVotePage2" component={withFooter(ElectionVotePage2)}/>
    <MainStack.Screen name="AstrologyPage1" component={withFooter(AstrologyPage1)}/>
    <MainStack.Screen name="AstrologyPage2" component={withFooter(AstrologyPage2)}/>
    <MainStack.Screen name="AstrologyPage3" component={withFooter(AstrologyPage3)}/>
    <MainStack.Screen name="Member0" component={withFooter(Member0)}/>
    <MainStack.Screen name="GovernmentPage1" component={withFooter(GovernmentPage)}/>
    <MainStack.Screen name="GovernmentPage2" component={withFooter(GovernmentPage2)}/>
    <MainStack.Screen name="Partiespage1" component={withFooter(PartiesPage1)}/>
    <MainStack.Screen name="Partiespage2" component={withFooter(PartiesPage2)}/> 
    <MainStack.Screen name="TownPage1" component={withFooter(TownPage1)}/> 
    <MainStack.Screen name="TownPage2" component={withFooter(TownPage2)}/> 
    <MainStack.Screen name ="TownBusiness1" component={withFooter(TownBusinessPage)}/>
    <MainStack.Screen name ="TownBusiness2" component={withFooter(TownBusinessPage1)}/>
    <MainStack.Screen name ="TownBusiness3" component={withFooter(TownBusinessPage2)}/>
    <MainStack.Screen name ="TownBusiness4" component={withFooter(TownBusinessPage3)}/>
    </MainStack.Navigator> 
  );
}

// App decides stack based on context
function RootNavigator() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainStackScreen /> : <AuthStackScreen />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}