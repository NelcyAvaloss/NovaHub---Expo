import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', 
    paddingTop: 40,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#E5E7EB',
    fontSize: 22,
    fontWeight: '700',
  },
  headerIcon: {
    color: '#38BDF8',
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#9CA3AF',
  },

  listContent: {
    paddingBottom: 24,
  },

  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#0B1120',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardUnread: {
    borderColor: '#38BDF8',
    backgroundColor: '#020617',
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  icon: {
    color: '#E5E7EB',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#38BDF8',
    position: 'absolute',
    top: 4,
    right: 4,
  },

  textContainer: {
    flex: 1,
  },
  title: {
    color: '#E5E7EB',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    color: '#9CA3AF',
    fontSize: 13,
    marginBottom: 4,
  },
  time: {
    color: '#6B7280',
    fontSize: 11,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    color: '#38BDF8',
    marginBottom: 12,
  },
  emptyText: {
    color: '#E5E7EB',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubText: {
    color: '#9CA3AF',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
