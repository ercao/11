{
  stdenv,
  cmake,
  ...
}
:
stdenv.mkDerivation {
  name = "ds";

  src = ./.;

  nativeBuildInputs = [cmake];
}
