import MapWrapper from '@/components/Map';
import MapFilterButton, {MapFilterState} from "@/components/map/controls/MapFilterButton";
import {View} from "tamagui";
import {useEffect, useState} from "react";
import {useThemeContext} from '@/context/ThemeSwitch';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useSession } from '@/context/SessionContext';
import { useUserDeviceStore } from '@/api/stores/userDevice';

export default function MapScreen() {
    const {isDark} = useThemeContext();
    const {session} = useSession();
    const userDeviceStore = useUserDeviceStore();

    const [module1Visible, setModule1Visible] = useState(true);
    const [module2Visible, setModule2Visible] = useState(true);
    const [module3Visible, setModule3Visible] = useState(false);

    // Create consolidated filter state
    const filterState: MapFilterState = {
        module1Visible,
        module2Visible,
        module3Visible,
    };

    const handleFilterChange = (newState: MapFilterState) => {
        if (newState.module1Visible !== module1Visible) setModule1Visible(newState.module1Visible);
        if (newState.module2Visible !== module2Visible) setModule2Visible(newState.module2Visible);
        if (newState.module3Visible !== module3Visible) setModule3Visible(newState.module3Visible);
    };

    const [expoPushToken, setExpoPushToken] = useState('');
    const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );

    const handleRegisterUserDevice = async (userId: number) => {
        if (Platform.OS === 'web') {return;}

        if (Platform.OS === 'android') {
            Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
        }
        registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });
        
        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            response
        });

        if(expoPushToken){
            await userDeviceStore.registerUserDevice({fcmToken: expoPushToken, userId: userId});
        }

        return () => {
        notificationListener.remove();
        responseListener.remove();
        };
    }

    useEffect(() => {
        if (session?.profile?.id) {
            handleRegisterUserDevice(session.profile.id);
        }
    },[expoPushToken, session?.profile?.id]);

    return (
        <View pos={"relative"} flex={1}>
            <MapWrapper
                module1Visible={module1Visible}
                module2Visible={module2Visible}
                module3Visible={module3Visible}
                isDark={isDark}
            />

            <MapFilterButton
                filterState={filterState}
                onFilterChange={handleFilterChange}
            />
        </View>
    );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('myNotificationChannel', {
      name: 'A channel is needed for the permissions prompt to appear',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}