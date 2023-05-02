{
  stdenv,
  cmake,
  libmysqlconnectorcpp,
  ...
}: let
  jsonLib = stdenv.mkDerivation rec {
    pname = "nlohmann-json";
    version = "3.11.2";

    src = builtins.fetchTarball {
      url = "https://github.com/nlohmann/json/releases/download/v${version}/json.tar.xz";
      sha256 = "0bksnrik1jj1ik3h5f6086hm6xn0d2dm8ycr03l4ipxwmjik6244";
    };

    installPhase = "mkdir $out && cp -r . $_";
  };
in
  stdenv.mkDerivation {
    name = "company";

    src = ./.;

    nativeBuildInputs = [cmake];

    buildInputs = [libmysqlconnectorcpp jsonLib];
  }
