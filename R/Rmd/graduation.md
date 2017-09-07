High school graduation
================

``` r
library(tidyverse)
library(stringr)
```

High school graduation rates
----------------------------

Comes from state Dept. of Education data site, downloaded & pieced together.

### Trends: NHPS vs CT by race

``` r
csv <- paste0("../input/graduation_files/graduation", c(".csv", " (1).csv", " (2).csv", " (3).csv")) %>%
  map(~read_csv(., skip = 5, na = c("", "*", "NA", "N/A"), col_types = cols(.default = "c")))
```

``` r
csv[[3]]$`Race/Ethnicity` <- "All"
csv[[4]]$`Race/Ethnicity` <- "All"
csv[[2]]$`District Code` <- NULL
csv[[3]]$`District Code` <- NULL
```

``` r
grad <- bind_rows(csv) %>%
  setNames(c("name", "race", "2012", "2013", "2014", "2015", "2016")) %>%
  gather(key = year, value = rate, -name, -race) %>%
  filter(race %in% c("All", "White", "Black", "Hispanic")) %>%
  mutate(name = as.factor(name) %>% forcats::fct_recode(CT = "State of Connecticut", NHPS = "New Haven School District")) %>%
  mutate(rate = as.numeric(rate) / 100)

# write_csv(grad, "graduation rates.csv")
```

``` r
grad_by_race <- grad %>% filter(name == "NHPS") %>% mutate(indicator = "nhps graduation by race")
grad_by_dist <- grad %>% filter(race == "All") %>% mutate(indicator = "total graduation by location")
grad_trend <- bind_rows(grad_by_dist, grad_by_race) %>%
  select(name, indicator, year, type = race, value = rate)

write_csv(grad_trend, "../output/graduation_rate_trends.csv")
```

### By school

``` r
grad2 <- read_csv("../input/grad_by_school.csv", skip = 4, na = c("*")) %>%
  select(1, 4, 5) %>%
  na.omit() %>%
  setNames(c("name", "raw", "value")) %>%
  mutate(value = value / 100, indicator = "graduation by nhps school", year = 2016) %>%
  select(name, indicator, year, value, raw) %>%
  mutate(name = as.factor(name) %>% forcats::fct_recode(
    "Co-Op" = "Cooperative High School",
    "ESUMS" = "Engineering - Science University Magnet School",
    "HSC" = "High School In The Community",
    "Career" = "Hill Regional Career High School",
    "Hillhouse" = "James Hillhouse High School",
    "Metro" = "Metropolitan Business Academy",
    "Cross" = "Wilbur Cross High School"
  ))

write_csv(grad2, "../output/graduation_rate_by_school.csv")
```
