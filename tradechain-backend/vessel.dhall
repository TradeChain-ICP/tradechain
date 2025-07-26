let upstream = https://github.com/dfinity/vessel-package-set/releases/download/mo-0.8.7-20230406/package-set.dhall

let packages = [
  { name = "base"
  , repo = "https://github.com/dfinity/motoko-base"
  , version = "moc-0.8.7"
  , dependencies = [] : List Text
  },
  { name = "matchers"
  , repo = "https://github.com/kritzcreek/motoko-matchers"
  , version = "v1.2.0"
  , dependencies = [ "base" ]
  }
]

in upstream # packages