import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import Modal from 'react-native-modal';

import { GRAY3, PRIMARYSOLID, PRIMARYSOLID7, WHITE } from 'shared/src/colors';
import CheckboxLabel from 'mobile/src/components/common/CheckboxLabel';
import PLabel from 'mobile/src/components/common/PLabel';
import { Body1Bold } from 'mobile/src/theme/fonts';

interface ReportPostModalProps {
  title?: string;
  subTitle?: string;
  isVisible: boolean;
  onPressConfirm: (violations: string[], comment: string) => void;
  onPressCancel: () => void;
}

interface ViolationItem {
  id: number;
  txt: string;
  value: string;
  isChecked: boolean;
}

const ViolationList: ViolationItem[] = [
  {
    id: 1,
    txt: 'Off-topic (not financial in nature)',
    value: 'off_topic',
    isChecked: false,
  },
  {
    id: 2,
    txt: 'Price or performance projection',
    value: 'projection',
    isChecked: false,
  },
  {
    id: 3,
    txt: 'Exaggeratory or promissory statements',
    value: 'exaggeration',
    isChecked: false,
  },
  { id: 4, txt: 'Promotional content', value: 'promotional', isChecked: false },
  {
    id: 5,
    txt: 'Discusses private funds, investments or trades',
    value: 'proprietary',
    isChecked: false,
  },
];

const ReportPostModal: React.FC<ReportPostModalProps> = (props) => {
  const { isVisible, onPressConfirm, onPressCancel } = props;
  const [violations, setViolations] = useState<ViolationItem[]>(ViolationList);
  const [comment, setComment] = useState('');

  const handleChange = (id: number) => {
    const temp = violations.map((category) => {
      if (id === category.id) {
        return { ...category, isChecked: !category.isChecked };
      }
      return category;
    });
    setViolations(temp);
  };

  const renderItem = ({ item }: { item: ViolationItem }) => (
    <CheckboxLabel
      id={item.id}
      category={item.txt}
      value={item.isChecked}
      handleChange={handleChange}
      viewStyle={styles.checkContainer}
    />
  );

  return (
    <Modal
      isVisible={isVisible}
      style={styles.bottomHalfModal}
      onBackdropPress={onPressCancel}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : undefined}>
        <View style={styles.modalWrapper}>
          <PLabel label="Report post" textStyle={styles.title} />
          <FlatList
            data={violations}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            keyExtractor={(item) => item.id.toString()}
          />
          <PLabel label="Other comments" textStyle={styles.title} />
          <TextInput
            value={comment}
            onChangeText={setComment}
            multiline
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onPressCancel} style={styles.cancelBtn}>
              <PLabel label="Cancel" textStyle={styles.title} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const violationValues = violations.map((item) => {
                  return item.value.toUpperCase();
                });
                onPressConfirm(violationValues, comment);
              }}
              style={styles.doneBtn}>
              <PLabel label="Send Report" textStyle={styles.title} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReportPostModal;

const styles = StyleSheet.create({
  modalWrapper: {
    backgroundColor: GRAY3,
    paddingHorizontal: 28,
    paddingVertical: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomHalfModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  title: {
    ...Body1Bold,
  },
  listContainer: {
    marginVertical: 16,
  },
  checkContainer: {
    backgroundColor: 'transparent',
    paddingLeft: 5,
    width: '100%',
  },
  buttonContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 16,
  },
  cancelBtn: {
    width: '45%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtn: {
    width: '45%',
    height: 45,
    borderRadius: 22,
    borderColor: PRIMARYSOLID,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARYSOLID7,
  },
  input: {
    backgroundColor: WHITE,
    padding: 11,
    paddingTop: 11,
    height: 136,
    borderRadius: 16,
    marginTop: 8,
  },
});
