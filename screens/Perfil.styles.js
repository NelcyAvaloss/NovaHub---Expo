import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  headerBg: {
    height: 330,
    justifyContent: 'flex-start',
    overflow: 'hidden',
    width: '100%',
  },

  headerBg: {
  height: 330,
  justifyContent: 'flex-start',
  overflow: 'hidden',
},

headerBar: {
  marginTop: 40,
  height: 44,
  justifyContent: 'center',
  alignItems: 'center',
},

headerTitle: {
  color: '#fff',
  fontSize: 20,
  fontWeight: '700',
  letterSpacing: 0.3,
  textAlign: 'center',
},

backBtn: {
  position: 'absolute',
  top: 40,   
  left: 15,
  padding: 6,
  zIndex: 10,
},
backIcon: {
  color: '#fff',
  fontSize: 40,
  lineHeight: 30,
},





  diagonalCut: {
    position: 'absolute',
    left: -50,
    right: -50,
    bottom: -70,
    height: 160,
    backgroundColor: '#fff',
    transform: [{ rotate: '-15deg' }],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  profileBlock: { alignItems: 'center', marginTop: -150, marginBottom: 8 },

  avatarWrap: {
    width: 135,
    height: 135,
    borderRadius: 70,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    borderWidth: 3,
    borderColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 4 },
    }),
  },

  avatar: { width: '100%', height: '100%' },

  statusDot: {
    position: 'absolute',
    right: 6,
    bottom: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1f2a44',
    borderWidth: 2,
    borderColor: '#fff',
  },

  name: { marginTop: 18, fontSize: 18, fontWeight: '800', color: '#0f172a' },

  menu: { marginTop: 35, paddingHorizontal: 20, gap: 10 },

  menuItem: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#eef1f7',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
  },

  menuItemText: { color: '#0f172a', fontWeight: '600' },

  menuItemArrow: { color: '#0f172a', opacity: 0.6, fontSize: 20, lineHeight: 20 },

  logoutBtn: {
    marginTop: 140,
    marginHorizontal: 20,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#3E5C76',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  logoutText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  logoutIcon: { color: '#fff', fontSize: 16 },
});
