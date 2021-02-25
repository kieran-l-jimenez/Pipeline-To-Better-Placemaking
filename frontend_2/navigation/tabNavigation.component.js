import React, { useState, useEffect, useLayoutEffect } from 'react';
import { BottomNavigation, BottomNavigationTab, Layout, Text, Icon } from '@ui-kitten/components';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeScreenStack } from './homeStack.component';
import { UserSettingsStack } from './userStack.component';
import { CollaborateStack } from './collaborateStack.component';

const { Navigator, Screen } = createBottomTabNavigator();

function BottomTabBar({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  /// Hide the tab bar
  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  const nav = (index) => {
    // if already on this tab, go to top of stack
    if (index === state.index && navigation.canGoBack()) {
      navigation.popToTop();
    } else {
      navigation.navigate(state.routeNames[index]);
    }
  }

  return (
    <BottomNavigation
      keyboardHidesNavigationBar={true}
      selectedIndex={state.index}
      onSelect={index => nav(index)}>
      <BottomNavigationTab icon={ClipBoardIcon}/>
      <BottomNavigationTab icon={HomeIcon}/>
      <BottomNavigationTab icon={PersonIcon}/>
    </BottomNavigation>
  );
};

export function TabNavigation(props) {

  var location = props.location;
  let setSignedIn = props.setSignedIn;

  // Hide Tabs for these screens within the 3 stack screens (CollaborateStack, HomeScreenStack, UserSettingsStack)
  const tabHiddenRoutes = ["CreateActivityStack", "StationaryActivity", "SurveyActivity"];

  function getTabBarVisibility(route) {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (tabHiddenRoutes.includes(routeName)) {
      //console.log("route: ", routeName, ", hide");
      return false;
    } else {
      //console.log("route: ", routeName, ", show");
      return true;
    }
  };

  return (
    <Navigator
      initialRouteName="HomeScreenStack"
      tabBar={props => <BottomTabBar {...props} />}
    >
      <Screen
        name="CollaborateStack"
        options={({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
        })}
      >
        {props =>
          <CollaborateStack
            {...props}
            location={location}
          >
          </CollaborateStack>
        }
      </Screen>
      <Screen
        name="HomeScreenStack"
        options={({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
        })}
      >
        {props =>
          <HomeScreenStack
            {...props}
            location={location}
          >
          </HomeScreenStack>
        }
      </Screen>
      <Screen
        name="UserSettingsStack"
        options={({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
        })}
      >
        {props =>
          <UserSettingsStack
            {...props}
            setSignedIn={setSignedIn}
          >
          </UserSettingsStack>
        }
      </Screen>
    </Navigator>
  );
};

const PersonIcon = (props) => (
    <Icon {...props} name='person-outline'/>
);

const ClipBoardIcon = (props) => (
    <Icon {...props} name='clipboard-outline'/>
);

const HomeIcon = (props) => (
    <Icon {...props} name='home-outline'/>
);
