{ stdenv
, cmake
, libmysqlconnectorcpp
, nlohmann_json
, ...
}:
stdenv.mkDerivation {
  name = "company";

  src = ./.;

  nativeBuildInputs = [ cmake ];

  buildInputs = [
    libmysqlconnectorcpp
    nlohmann_json
  ];
}
