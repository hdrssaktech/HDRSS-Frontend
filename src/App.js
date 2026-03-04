import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { VoteProvider  } from "./context/VoteContext.js";
import { LocationProvider } from "./context/LocationContext.js";

import Loginpage from "./pages/AuthPage/LoginPage";
import Recovery from "./pages/AuthPage/RecoveryPage";
import SigninPage from "./pages/AuthPage/SigninPage";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./components/Profile/Profile";
import Footer from "./components/Footer/Footer";
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
import DistrictBusinessPage1 from "./pages/DistrictPage/DistrictBusiness/DistrictBusinessPage1.js";
import DistrictBusinessPage2 from "./pages/DistrictPage/DistrictBusiness/DistrictBusinessPage2.js";
import DistrictBusinessPage3 from "./pages/DistrictPage/DistrictBusiness/DistrictBusinessPage3.js";
import DistrictBusinessPage4 from "./pages/DistrictPage/DistrictBusiness/DistrictBusinessPage4.js";
import DistrictBusinessPage0 from "./pages/DistrictPage/DistrictBusiness/DistrictBusinessPage0.js";
import TownGovernmentPage1 from "./pages/DistrictPage/TownPage/BusinessCategory/TownGovernmentPage1.js";
import TownGovernmentPage2 from "./pages/DistrictPage/TownPage/BusinessCategory/TownGovernmentPage2.js";
import FamousPlaceDetails from "./pages/DistrictPage/TownPage/BusinessCategory/FamousPlace.js";
import TouristSpotDetails from "./pages/DistrictPage/TownPage/BusinessCategory/TouristPlace.js";
import PartiesPage3 from "./pages/DistrictPage/Parties/PartiesPage3.js";
import PartiesPage4 from "./pages/DistrictPage/Parties/PartiesPage4.js";
import TownPartiesCategory from "./pages/DistrictPage/TownPage/BusinessCategory/TownParties/TownPartiesCategory.js";
import TownPartiesRoles from "./pages/DistrictPage/TownPage/BusinessCategory/TownParties/TownPartiesRole.js";
import TownPartiesMember from "./pages/DistrictPage/TownPage/BusinessCategory/TownParties/TownPartiesMember.js";
import TownPartiesMemdetails from "./pages/DistrictPage/TownPage/BusinessCategory/TownParties/TownPartiesMemdetails.js";
import DistrictBusinessItems from "./pages/DistrictPage/DistrictBusiness/DistrictBusinessItems.js";
import VaasthuPage0 from "./pages/ElectionCategorysPage/VaasthuPage/VaasthuPage";
import VaasthuPage1 from "./pages/ElectionCategorysPage/VaasthuPage/VaasthuPage1.js";
import VaasthuPage2 from "./pages/ElectionCategorysPage/VaasthuPage/VaasthuPage2.js";
import VaasthuPage3 from "./pages/ElectionCategorysPage/VaasthuPage/VaasthuPage3.js";
import Assemblies from "./pages/VotePage/Assemblies.js";
import PartiesResult from "./pages/VotePage/PartiesResult.js";
import Election2021Screen from "./pages/VotePage/Election2021Screen .js";
import TourismPlaces from "./pages/ElectionCategorysPage/TourismPage/TourismPlaces.js";
import TourismPlaceDetails from "./pages/ElectionCategorysPage/TourismPage/TourismPlaceDetails.js";
import PoojaCategory from "./pages/ElectionCategorysPage/PoojaPage/PoojaCategory.js";
import PoojaDetails from "./pages/ElectionCategorysPage/PoojaPage/PoojaDetails.js";
import BhakthiNoolgal1 from "./pages/ElectionCategorysPage/BhakthiNoolgal.js/BhakthiNoolgal1.js";
import BhakthiNoolgal2 from "./pages/ElectionCategorysPage/BhakthiNoolgal.js/BhakthiNoolgal2.js";
import BhakthiNoolgal3 from "./pages/ElectionCategorysPage/BhakthiNoolgal.js/BhakthiNoolgal3.js";

import DetailsScreen from "./pages/ElectionCategorysPage/HinduThuvm/HinduThuvm.js";
import HinduLeaders1 from "./pages/ElectionCategorysPage/HinduThuvm/HinduLeaders/HinduLeaders1.js";
import HinduLeaders2 from "./pages/ElectionCategorysPage/HinduThuvm/HinduLeaders/HinduLeaders2.js";
import HinduLeaders3 from "./pages/ElectionCategorysPage/HinduThuvm/HinduLeaders/HinduLeaders3.js";
import HinduSamayam1 from "./pages/ElectionCategorysPage/HinduThuvm/HinduSamayam/HinduSamayam1.js";
import HinduSamayam2 from "./pages/ElectionCategorysPage/HinduThuvm/HinduSamayam/HinduSamayam2.js";
import HinduSamayam3 from "./pages/ElectionCategorysPage/HinduThuvm/HinduSamayam/HinduSamayam3.js";
import HinduNoolgal1 from "./pages/ElectionCategorysPage/HinduThuvm/HinduNoolgal/HinduNoolgal1.js";
import HinduNoolgal2 from "./pages/ElectionCategorysPage/HinduThuvm/HinduNoolgal/HinduNoolgal2.js";
import HinduNoolgal3 from "./pages/ElectionCategorysPage/HinduThuvm/HinduNoolgal/HinduNoolgal3.js";
import Panchangam from "./pages/ElectionCategorysPage/Panchangam/Panchangam.js";
// import PanchangamNaalKaati from "./pages/ElectionCategorysPage/Panchangam/PanchangamNaalKaati.js";
import NaalKaatiPanchangam from "./pages/ElectionCategorysPage/Panchangam/PanchangamRoute/NaalKaatiPanchangam.js";
import IndraiyaPanchangam from "./pages/ElectionCategorysPage/Panchangam/PanchangamRoute/IndraiyaPanchangam.js";
import MaathakaatiPanchangam from "./pages/ElectionCategorysPage/Panchangam/PanchangamRoute/MaathakaatiPanchangam.js";
import MukiyaThinangal from "./pages/ElectionCategorysPage/Panchangam/PanchangamRoute/MukiyaThinangal.js";
import GowriPanchangam from "./pages/ElectionCategorysPage/Panchangam/PanchangamRoute/GowriPanchangam.js";




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
    <MainStack.Screen name="Poojacategory" component={withFooter(PoojaCategory)}/>
    <MainStack.Screen name="PoojaDetails" component={withFooter(PoojaDetails)}/>
    <MainStack.Screen name="LeaderPage1" component={withFooter(LeaderPage1)}/> 
    <MainStack.Screen name="LeaderPage2" component={withFooter(LeaderPage2)}/>
    <MainStack.Screen name="LeaderPage3" component={withFooter(LeaderPage3)}/>
    <MainStack.Screen name="TourismPage1" component={withFooter(TourismPage1)}/>
    <MainStack.Screen name="TourismPage2" component={withFooter(TourismPage2)}/>
    <MainStack.Screen name="TourismPage3" component={withFooter(TourismPage3)}/>
    <MainStack.Screen name="TourismPlaces" component={withFooter(TourismPlaces)}/>
    <MainStack.Screen name="TourismPlaceDetails" component={withFooter(TourismPlaceDetails)}/>
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
    <MainStack.Screen name="Partiespage3" component={withFooter(PartiesPage3)}/> 
    <MainStack.Screen name="Partiespage4" component={withFooter(PartiesPage4)}/>
    <MainStack.Screen name="TownPage1" component={withFooter(TownPage1)}/> 
    <MainStack.Screen name="TownPage2" component={withFooter(TownPage2)}/> 
    <MainStack.Screen name ="TownBusiness1" component={withFooter(TownBusinessPage)}/>
    <MainStack.Screen name ="TownBusiness2" component={withFooter(TownBusinessPage1)}/>
    <MainStack.Screen name ="TownBusiness3" component={withFooter(TownBusinessPage2)}/>
    <MainStack.Screen name ="TownBusiness4" component={withFooter(TownBusinessPage3)}/>
    <MainStack.Screen name="DistrictBusinessPage0" component={withFooter(DistrictBusinessPage0)} />
    <MainStack.Screen name="DistrictBusinessPage1" component={withFooter(DistrictBusinessPage1)} />
    <MainStack.Screen name="DistrictBusinessPage2" component={withFooter(DistrictBusinessPage2)} />
    <MainStack.Screen name="DistrictBusinessPage3" component={withFooter(DistrictBusinessPage3)} />
    <MainStack.Screen name="DistrictBusinessPage4" component={withFooter(DistrictBusinessPage4)} />
    <MainStack.Screen name="DistrictBusinessItems" component={withFooter(DistrictBusinessItems)} />
    <MainStack.Screen name="TownGovernmentPage1" component={withFooter(TownGovernmentPage1)} />
    <MainStack.Screen name="TownGovernmentPage2" component={withFooter(TownGovernmentPage2)} />
    <MainStack.Screen name="TownParties" component={withFooter(TownPartiesRoles)} />
    <MainStack.Screen name="TownPartiesCategory" component={withFooter(TownPartiesCategory)} />
    <MainStack.Screen name="TownPartiesMember" component={withFooter(TownPartiesMember)} />
    <MainStack.Screen name="TownPartiesMemberDetails" component={withFooter(TownPartiesMemdetails)} />
    <MainStack.Screen name="FamousPlace" component={withFooter(FamousPlaceDetails)} />
    <MainStack.Screen name="TouristPlace" component={withFooter(TouristSpotDetails)}/>
    <MainStack.Screen name="VaasthuPage" component={withFooter(VaasthuPage0)}/>
    <MainStack.Screen name="VaasthuPage1" component={withFooter(VaasthuPage1)}/>
    <MainStack.Screen name="VaasthuPage2" component={withFooter(VaasthuPage2)}/>
    <MainStack.Screen name="VaasthuPage3" component={withFooter(VaasthuPage3)}/>  
    <MainStack.Screen name="BhakthiNoolgal1" component={withFooter(BhakthiNoolgal1)}/>  
    <MainStack.Screen name="BhakthiNoolgal2" component={withFooter(BhakthiNoolgal2)}/>  
    <MainStack.Screen name="BhakthiNoolgal3" component={withFooter(BhakthiNoolgal3)}/>  
     <MainStack.Screen name="HinduThuvm" component={withFooter(DetailsScreen)}/>  
    <MainStack.Screen name="HinduLeaders1" component={withFooter(HinduLeaders1)}/> 
    <MainStack.Screen name="HinduLeaders2" component={withFooter(HinduLeaders2)}/>
    <MainStack.Screen name="HinduLeaders3" component={withFooter(HinduLeaders3)}/>
    <MainStack.Screen name="HinduSamayam1" component={withFooter(HinduSamayam1)}/>
    <MainStack.Screen name="HinduSamayam2" component={withFooter(HinduSamayam2)}/>
    <MainStack.Screen name="HinduSamayam3" component={withFooter(HinduSamayam3)}/>
    <MainStack.Screen name="HinduNoolgal1" component={withFooter(HinduNoolgal1)}/>
    <MainStack.Screen name="HinduNoolgal2" component={withFooter(HinduNoolgal2)}/>
    <MainStack.Screen name="HinduNoolgal3" component={withFooter(HinduNoolgal3)}/>
    <MainStack.Screen name="Panchangam" component={withFooter(Panchangam)}/>
    <MainStack.Screen name="NaalKaatiPanchangam" component={withFooter(NaalKaatiPanchangam)}/>
    <MainStack.Screen name="MaathaKaatiPanchangam" component={withFooter(MaathakaatiPanchangam)}/>
    <MainStack.Screen name="IndraiyaPanchangam" component={withFooter(IndraiyaPanchangam)}/>
    <MainStack.Screen name="MukiyaThinangal" component={withFooter(MukiyaThinangal)}/>
      <MainStack.Screen name="GowriPanchangam" component={withFooter(GowriPanchangam)}/>
    

    <MainStack.Screen name="Assemblies" component={withFooter(Assemblies)}/>
    <MainStack.Screen name="VotePartiesResult" component={withFooter(PartiesResult)}/>
    <MainStack.Screen name="Vote2023Result" component={withFooter(Election2021Screen)}/>
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
     <VoteProvider>
      <LocationProvider>
       <RootNavigator />
      </LocationProvider>
     </VoteProvider>
    </AuthProvider>
  );
}


