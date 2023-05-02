{
  stdenv,
  cmake,
  ...
}:
stdenv.mkDerivation {
  name = "mst";

  src = ./.;

  nativeBuildInputs = [cmake];
}
