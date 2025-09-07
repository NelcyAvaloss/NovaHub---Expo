import { StyleSheet } from "react-native";

export default StyleSheet.create({
  flex: { flex: 1 },

  bg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },

  // Botón volver
  backButton: {
    position: "absolute",
    top: 30,
    left: 16,
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
    elevation: 3,
  },
  backIcon: {
    fontSize: 45,
    lineHeight: 30,
    color: "#fff",
  },

  // Header/Logo (inerte)
  header: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,
    width: "100%",
    alignItems: "center",
  },

  logo: { width: 210, height: 210 },

  // Tarjeta
  card: {
    position: "relative",
    zIndex: 10,
    elevation: 10,
    width: "88%",
    backgroundColor: "rgba(47, 51, 61, 0.72)",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },

  cardTitle: {
    fontSize: 18,
    color: "#EAF2FF",
    fontWeight: "700",
    marginBottom: 16,
  },

  /* INPUT */
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 14, 22, 0.85)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(150, 160, 180, 0.25)",
    marginBottom: 14,
    minHeight: 48,
  },
  inputWrapperFocused: {
    borderColor: "#6CA5FF",
    shadowColor: "#6CA5FF",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  iconBox: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "rgba(150, 160, 180, 0.22)",
  },
  iconText: { fontSize: 16, color: "#D8E4FF" },

  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    color: "#EAF2FF",
    fontSize: 14,
  },

  // Botón ojito
  eyeBox: {
    paddingHorizontal: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  eyeText: {
    fontSize: 16,
    color: "#D8E4FF",
  },

  // Hints
  hintsBox: {
    minHeight: 4,
    marginBottom: 4,
  },
  hintText: {
    color: "#ffb4b4",
    fontSize: 12,
    marginBottom: 2,
  },

  /* BOTÓN */
  primaryBtn: {
    height: 46,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2F80ED",
    marginTop: 10,
  },
  primaryBtnDisabled: {
    backgroundColor: "rgba(47,128,237,0.45)",
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  primaryBtnTextDisabled: {
    color: "rgba(255,255,255,0.7)",
  },
  pressed: { opacity: 0.85 },

  /* LINK */
  loginRow: {
    marginTop: 12,
    alignItems: "center",
  },
  loginLink: {
    color: "#6CA5FF",
    fontSize: 13,
    fontWeight: "700",
  },
  loginLinkPressed: { opacity: 0.7 },
});
