import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* HEADER */
  headerBg: {
    width: '100%',
    height: 96,
    resizeMode: 'cover',
  },
  headerBar: {
    marginTop: 40,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { color: '#fff', fontSize: 40, lineHeight: 30 },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  /* CONTENIDO */
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0e0e2c',
    opacity: 0.9,
  },
});
