import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Picker,
  Platform,
} from 'react-native';

import { theme } from '../../theme';

const ios = Platform.OS === 'ios';

const MyPicker = ({
  value, setValue, data, label,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  if (ios) {
    return (
      <>
        <PickerButton
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          label={(value || label)?.toUpperCase()}
        />
        <PickerModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          value={value}
          setValue={setValue}
          data={data}
        />
      </>
    );
  }

  return (
    <PickerFakeButton
      label={(value || label)?.toUpperCase()}
    >
      <NativePicker
        value={value}
        setValue={setValue}
        style={{ ...styles.openButton, ...styles.textStyle }}
        data={data}
      />
    </PickerFakeButton>
  );
};

const PickerButton = ({
  modalVisible, setModalVisible, label, children,
}) => (
  <TouchableOpacity
    style={styles.openButton}
    onPress={() => {
      setModalVisible(!modalVisible);
    }}
  >
    <Text style={styles.textStyle}>{label}</Text>
  </TouchableOpacity>
);

const PickerFakeButton = ({ label, children }) => (
  <View style={styles.openButton}>
    <View style={styles.secretView}>
      {children}
    </View>
    <View style={styles.hideArrow} />
    <Text style={styles.textStyle}>{label}</Text>
  </View>
);

const PickerModal = (props) => {
  const {
    modalVisible, setModalVisible, value, setValue, data,
  } = props;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      onDismiss={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <NativePicker value={value} setValue={setValue} data={data} />
        </View>
        <TouchableOpacity
          style={{ ...styles.openButton, maxWidth: 260 }}
          onPress={() => {
            if (value === '') setValue(data[0]);
            setModalVisible(false);
          }}
        >
          <Text style={styles.textStyle}>Ok</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const NativePicker = ({ value, setValue, data }) =>
  // TODO: on open set data[0], use Index to fix android bug
  (
    <Picker
      selectedValue={value}
      style={ios ? styles.iospicker : styles.androidpicker}
      onValueChange={(itemValue, itemIndex) => { setValue(itemValue); }}
      mode="dialog"
    >
      {
        data.map((item, index) => <Picker.Item label={item} value={item} key={index} />)
      }
    </Picker>
  );
export default MyPicker;

const styles = StyleSheet.create({
  iospicker: {
    width: 220,
  },
  secretView: {
    position: 'absolute',
    top: 0,
    right: 10,
  },
  androidpicker: {
    width: 250,
    color: 'transparent',
  },
  openButton: {
    backgroundColor: theme.colors.blue2,
    borderRadius: 8,
    width: '100%',
    minWidth: 250,
    padding: 12,
    marginTop: 20,
  },
  textStyle: {
    color: theme.colors.gray2,
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.big,
    textAlign: 'center',
  },
  hideArrow: {
    position: 'absolute',
    right: 20,
    bottom: 10,
    height: 20,
    width: 20,
    backgroundColor: theme.colors.blue2,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
