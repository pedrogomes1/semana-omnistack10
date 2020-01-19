import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Main from "./pages/Main";
import Profile from "./pages/Profile";

const Routes = createAppContainer(
  createStackNavigator(
    {
      //Rota main e rota profile
      Main: {
        screen: Main,
        navigationOptions: {
          title: "DevRadar"
        }
      },
      Profile: {
        screen: Profile,
        navigationOptions: {
          title: "Perfil do Github"
        }
      }
    }, {
      defaultNavigationOptions: {
        //Aplicados a todas as telas
        headerTintColor: "#FFF", //Titulo branco
        headerBackTitleVisible: false,//Tira o nome do back do lado da flecha quando navegar de uma pagina p outra
        headerStyle: {
          backgroundColor: "#7D40E7",
        }
      }
    }
  )
);

export default Routes;
